import {ExtractorConfig} from "./ExtractorConfig";
import {SourceType} from "../enums/SourceType";
import { QueueService } from "../services/QueueService";
import { Logger } from "../utils/Logger";
import { ZodObject, ZodSchema, z } from "zod";
import { Services } from "./Services";
import { DbService } from "../services/DbService";
import { ZodHelper } from "../utils/Zod";

const extractorStateValidator = z.object({
    cursor: z.number().optional(),
    timestampFrom: z.number(),
    timestampTo: z.number().optional(),
})
type ExtractorState = z.infer<typeof extractorStateValidator>
export abstract class BaseExtractor<TSource extends SourceType, TMessage extends ZodObject<any>> {
    private config: ExtractorConfig<TSource, TMessage>;
    private queue: QueueService<TMessage>;
    protected logger: Logger;
    protected services: Services;
    protected db: DbService;

    constructor(config: ExtractorConfig<TSource, TMessage>, services: Services) {
        this.config = config;
        const invoker = this.getName()
        const validator =  this.getValidator();
        this.queue = new QueueService(validator, invoker)
        this.db = new DbService(config.source)
        this.logger = new Logger(invoker)
        this.services = services;
    }

    getName(): string {
        return this.config.source.key+":"+this.constructor.name + ':' + this.config.exchange;
    }

    async start() {
        let readyToStart = true;
        await this.services.redis.initialize()
        await this.db.initialize()

        const interval = setInterval(async () =>{
            try {
                this.logger.info(`Checking if can start the cycle: ${readyToStart}`)
                if(!readyToStart){
                    return
                }
                readyToStart = false
                const state = await this.getCurrentState()
                await this.cycle(state)
            } catch(e: unknown) {
                this.logger.error('Caught error in cycle', e)
            }
            readyToStart = true
        }, this.config.interval)
    }

    async cycle(state: ExtractorState) {
        this.logger.info("Starting cycle", {state})
        const limit = this.config.pageSize
        let timestampTo: number
        if(state.timestampTo){
            timestampTo = state.timestampTo
        } else {
            const latest = await this.findLatestRecordData()
            if(!latest){
                this.logger.info("Unable to find the latest timestamp. Considering table empty, skipping cycle")
                return;
            }
            if(latest.timestamp == state.timestampFrom){
                this.logger.info("Latest timestamp equals to the newest message timestamp, skipping cycle.")
                return;
            }
            // sleeping for at least 1 second to make sure no records with higher timestamp can be present in DB
            await await new Promise(resolve => setTimeout(resolve,1000))
            timestampTo = latest.timestamp
        }
      
        let publishCount = 0;
        let firstCycle = true
        let fetchCount = 1;
        while(true){
            this.logger.info(`Fetching records, fetch: ${fetchCount++}`)
            const messages = await this.extract(state.timestampFrom, timestampTo,this.config.pageSize,state.cursor)
            const firstMessage = messages[0]
            const lastMessage = messages[messages.length-1]
            if(firstMessage && lastMessage) {
                state.cursor = lastMessage[this.getCursorFieldAlias()]
                await this.queue.pushMessages(messages)
                publishCount += messages.length
            }
            if(messages.length < limit) {
                break
            }
            this.setCurrentState(state)

        }
        if(publishCount > 0) {
            state.timestampFrom = timestampTo
            state.timestampTo = undefined
            await this.setCurrentState(state)
        }
        this.logger.info(`Finished cycle, published: ${publishCount}`)
    }

    private async findLatestRecord(): Promise<z.infer<TMessage> | undefined>  {
        const lastRecordQuery = this.getQuery() + ` 1=1 ORDER BY ${this.getTimeStampFieldAlias().toString()} DESC LIMIT 1`
        const result = await this.db.query(lastRecordQuery)
        const validated  = z.array(z.any()).safeParse(result)
        if(!validated.success){
            this.logger.info('Query result not validated',{result})
            throw new Error("The result of the query haven't passed validation:" + ZodHelper.getFieldError(validated.error))
        }
        const lastRecord = validated.data[0];
        return lastRecord
    }
    private async findLatestRecordData(): Promise<{timestamp: number, cursor: number} | undefined>  {
        const lastRecord = await this.findLatestRecord()
        if(!lastRecord){
            // legitimate outcome, may not be any records at all
            return
        }
        const timestampValue = lastRecord[this.getTimeStampFieldAlias()]
        const validatedTimeStamp = z.number().safeParse(timestampValue)
        if(!validatedTimeStamp.success){
            throw new Error("The timestamp of the record isn't a number")
        }
        
        const cursorValue = lastRecord[this.getCursorFieldAlias()]
        const validatedCursor = z.number().safeParse(cursorValue)
        if(!validatedCursor.success){
            throw new Error("The cursor of the record isn't a number")
        }
        return {timestamp: validatedTimeStamp.data, cursor: validatedCursor.data}
    }

    private async setCurrentState(state: ExtractorState): Promise<void> {
        await this.services.redis.setObjectByKey(this.getRedisKey(),state)
    }

    private async getCurrentState(): Promise<ExtractorState> {
        const value = await this.services.redis.getObjectByKey(this.getRedisKey())
        const parsed = extractorStateValidator.safeParse(value)
        if(parsed.success) {
            return parsed.data
        }
        return {
            timestampFrom: 0,
        }
    }

    private getRedisKey(): string {
        return this.config.exchange
    }

    private async extract(timestampFrom: number, timestampTo: number, limit: number, cursorValue?: number): Promise<z.infer<TMessage>[]> {
        const query = this.getQuery() + ` ${this.getTimestampFieldValueSql()} >= ${timestampFrom} AND ${this.getTimestampFieldValueSql()} <= ${timestampTo}`
        const cursorPart = cursorValue ? `AND  ${this.getCursorFieldValueSql().toString()} > ${cursorValue}` : ''
        const limitPart =  ` ORDER BY ${this.getCursorFieldAlias().toString()} LIMIT ${limit} `
        const finalQuery = query + cursorPart + limitPart
        const result = await this.db.query(finalQuery)
        const validatedArray = z.array(z.any()).safeParse(result)
        if(!validatedArray.success){
            throw new Error("Couldn't validate batch. Query result is not an array")
        }
        const rows: z.infer<TMessage>[] = []
        for(const row of validatedArray.data){
            const validated = this.getValidator().safeParse(row);
            if(!validated.success){
                this.logger.info('Row failed validation',{row})
                throw new Error("The result of the query haven't passed validation: " + ZodHelper.getFieldError(validated.error))
            }
            rows.push(validated.data)
        }
        return rows
    }

    protected abstract getTimeStampFieldAlias(): keyof z.infer<TMessage>
    protected abstract getTimestampFieldValueSql(): string
    protected abstract getCursorFieldAlias(): keyof z.infer<TMessage>
    protected abstract getCursorFieldValueSql(): string
    public abstract getValidator(): TMessage
    protected abstract getQuery(): string
}