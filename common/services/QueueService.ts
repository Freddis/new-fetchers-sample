import { ZodObject, ZodRawShape, z } from "zod";
import { Logger } from "../utils/Logger";
import { Service } from "../types/Service";

export class QueueService<T extends ZodObject<any>> implements Service {
    validator: T;
    logger: Logger;
    debugStorage: T[] = []
    static debugCallbacks: ((msg:z.infer<any>) => Promise<boolean>)[] = []

    constructor(validator: T, invoker: string){
        this.validator = validator
        this.logger = new Logger(`${this.constructor.name}-${invoker}`)

    }
    async initialize(): Promise<void> {
    }

    async pushMessages(messages: z.infer<T>[]): Promise<void> {
        if(messages.length == 0){
            return;
        }
        this.logger.info(`Pushing messages: '${messages.length}' `)
        for(const message of messages){
            const result = this.validator.safeParse(message)
            if(!result.success){
                this.logger.info("Validation failed for message", {message,error: result.error})
                continue
            }
            this.logger.info('Pushing data onto',result.data)
            QueueService.debugCallbacks.forEach(x => x(message))
        }
    }

    async popMessage(callback: (message: z.infer<T>) => Promise<boolean>): Promise<void> {
        QueueService.debugCallbacks.push(callback)
    }
}