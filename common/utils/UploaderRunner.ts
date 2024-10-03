import { TypeOf, z, ZodObject } from "zod";
import { DestinationType } from "../enums/DestinationType";
import { UploaderConf } from "../types/FetchersConfig";
import { QueueService } from "../services/QueueService";
import { DbService } from "../services/DbService";
import { Logger } from "./Logger";
import { Services, UploaderServices } from "../types/Services";

export class UploaderRunner<
TDestination extends DestinationType,
TSourceMessage extends ZodObject<any>,
TDestinationMessage extends object> {
    config: UploaderConf<TDestination, TSourceMessage, TDestinationMessage>;
    logger: Logger;
    services: UploaderServices<TSourceMessage>;
    db: DbService;

    constructor(config: UploaderConf<TDestination,TSourceMessage,TDestinationMessage>, services: UploaderServices<NoInfer<TSourceMessage>>){
        this.config = config;
        const invoker = this.getName()
        this.services = services;
        this.db = new DbService(config.destination)
        this.logger = new Logger(invoker)
    }

    async start(): Promise<void> {
        await this.services.queue.initialize()
        await this.db.initialize()

        this.services.queue.popMessage(async (message) => {
            try {
                const result = await this.onMessage(message);
                return result;
            }catch(e: unknown){
                this.logger.error("Could'n process message",e,{message})
                return false
            }
        })
    }

    async onMessage(message: z.infer<TSourceMessage>): Promise<boolean> {
        const transformed = await this.config.transformer.transform(message);
        const reuslt = await this.config.uploader.upload(this.db,transformed);
        return reuslt;
    }

    getName(): string {
        return this.constructor.name + ':' + this.config.destination;
    }
}