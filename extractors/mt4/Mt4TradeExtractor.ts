import {BaseExtractor} from "../../common/types/BaseExtractor";
import {SourceType} from "../../common/enums/SourceType";
import {ForexTrade, ForexTradeValidator, forexTradeValidator} from "./messages/ForexTrade";
import { ZodObject, ZodNumber, ZodString, ZodDate, ZodTypeAny } from "zod";

export class Mt4TradeExtractor extends BaseExtractor<SourceType.REPORTING_MT4_DB, ForexTradeValidator> {
    protected override getCursorFieldValueSql(): string {
        throw new Error("Method not implemented.");
    }
    protected override getTimestampFieldValueSql(): string {
        throw new Error("Method not implemented.");
    }
    protected override getTimeStampFieldAlias(): "symbol" | "id" | "updatedAt" {
        throw new Error("Method not implemented.");
    }
    protected override getCursorFieldAlias(): "symbol" | "id" | "updatedAt" {
        throw new Error("Method not implemented.");
    }
    protected override getQuery(): string {
        throw new Error("Method not implemented.");
    }

    override getValidator(): ForexTradeValidator {
        return forexTradeValidator
    }
    
}
