import {DestinationType} from "../enums/DestinationType";
import { DbService } from "../services/DbService";
import { QueueService } from "../services/QueueService";

export abstract class BaseUploader<TDestination extends DestinationType, TMessage extends object> {
    private destination: TDestination;
    // private queue: QueueService<TMessage>;

    constructor( destination: TDestination) { 
        this.destination = destination
    }

    getName() {
        return this.constructor.name + ":" + this.destination
    }

    abstract upload(db: DbService, msg: TMessage): Promise<boolean>

}
