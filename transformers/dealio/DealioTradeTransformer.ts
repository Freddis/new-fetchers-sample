import {BaseTransformer} from "../../common/types/BaseTransformer";
import {DealioTrade} from "./messages/DealioTrade";
import {ForexTrade} from "../../extractors/mt4/messages/ForexTrade";

export class DealioTradeTransformer extends BaseTransformer<ForexTrade, DealioTrade> {
    async transform(input: ForexTrade): Promise<DealioTrade> {
        return {
            ...input,
            somethingDealioOnly: 'dasd',
        };
    }
}
