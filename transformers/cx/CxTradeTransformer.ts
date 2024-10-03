import {CxTrade} from "./messages/CxTrade";
import {BaseTransformer} from "../../common/types/BaseTransformer";
import {ForexTrade} from "../../extractors/mt4/messages/ForexTrade";

export class CxTradeTransformer extends BaseTransformer<ForexTrade, CxTrade> {
    async transform(input: ForexTrade): Promise<CxTrade> {
        return {
            ...input,
            somethingCxOnly: 1,
        };
    }
}
