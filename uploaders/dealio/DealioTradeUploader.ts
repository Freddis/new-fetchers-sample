import {DealioTrade} from "../../transformers/dealio/messages/DealioTrade";
import {BaseUploader} from "../../common/types/BaseUploader";
import {DestinationType} from "../../common/enums/DestinationType";
import { DbService } from "../../common/services/DbService";

export class DealioTradeUploader extends BaseUploader<DestinationType.DealioReplica,DealioTrade> {

    constructor(){
        super(DestinationType.DealioReplica)
    }
    
    async upload(db: DbService, msg: DealioTrade): Promise<boolean> {
        return false;
    }
}
