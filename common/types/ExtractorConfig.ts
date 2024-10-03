import {BaseExtractor} from "./BaseExtractor";
import {SourceConfig} from "./FetchersConfig";
import {SourceType} from "../enums/SourceType";
import {Exchange} from "../enums/Exchange";
import { ZodObject } from "zod";
import { Services } from "./Services";

export interface ExtractorConfig<TSource extends SourceType, TMessage extends ZodObject<any>> {
    source: SourceConfig<TSource>
    exchange: Exchange
    interval: number,
    pageSize: number,
    enabled: boolean,
    implementation: {
        new (config: ExtractorConfig<NoInfer<TSource>, TMessage>, services: Services): BaseExtractor<NoInfer<TSource>, TMessage>;
    }
}
