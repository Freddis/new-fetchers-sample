import {BaseUploader} from "../../common/types/BaseUploader";
import {CxTrade} from "../../transformers/cx/messages/CxTrade";
import {DestinationType} from "../../common/enums/DestinationType";
import { DbService } from "../../common/services/DbService";

export class CxTradeUploader extends BaseUploader<DestinationType.CxReplica,CxTrade> {

    constructor(){
        super(DestinationType.CxReplica)
    }
    async upload(db: DbService, msg: CxTrade): Promise<false> {
        return false;
    }
}
