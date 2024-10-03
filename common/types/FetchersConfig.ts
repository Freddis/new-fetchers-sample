import {BaseUploader} from "./BaseUploader";
import {BaseTransformer} from "./BaseTransformer";
import {ExtractorConfig} from "./ExtractorConfig";
import {SourceType} from "../enums/SourceType";
import {SourceName} from "../enums/SourceName";
import {DestinationType} from "../enums/DestinationType";
import { z, ZodObject } from "zod";
import { Environment } from "../enums/Environment";
import { DbType } from "../enums/DbType";
import { dbTypeMap } from "../enums/dbTypeMap";

export type SourceMap = {
    [key in SourceName]: SourceConfig<any,key>
}

export type DestinationMap = {
    [key in string]: DestinationConfig<any>
}



export class UploaderConf<
    TDestination extends DestinationType,
    TSourceMessage extends ZodObject<any>,
    TDestinationMessage extends object
> {
    public readonly destination: DestinationConfig<TDestination>
    public readonly transformer: BaseTransformer<z.infer<TSourceMessage>, TDestinationMessage>
    public readonly uploader: BaseUploader<TDestination, TDestinationMessage>

    constructor(options: {
        destination: DestinationConfig<TDestination>,
        transformer: BaseTransformer<z.infer<TSourceMessage>, TDestinationMessage>,
        uploader: BaseUploader<NoInfer<TDestination>, NoInfer<TDestinationMessage>>
    }) {
        this.destination = options.destination
        this.transformer = options.transformer
        this.uploader = options.uploader
    }
}

export type DbTypeMap = {
    [key in SourceType]: DbType
} & {
    [key in DestinationType]: DbType
}

export interface BaseSourceConfig<TSource extends SourceType, Tkey = SourceName> {
    type: TSource,
    key: Tkey
}



export interface MysqlConfig {
    host: string,
    port: number,
    user: string,
    password:string,
    database: string,
    poolSize: number,
}

export interface PostgresConfig extends MysqlConfig {
    schema: string
}

export interface PostgresSourceConfig<TSource extends SourceType, Tkey = SourceName> extends PostgresConfig, BaseSourceConfig<TSource,Tkey>{
}
export interface MysqlSourceConfig<TSource extends SourceType, Tkey = SourceName> extends MysqlConfig, BaseSourceConfig<TSource,Tkey>{
}
export type SourceConfig<
TSource extends SourceType, 
Tkey = SourceName
> = typeof dbTypeMap[TSource] extends DbType.postgres ? PostgresSourceConfig<TSource,Tkey> : MysqlSourceConfig<TSource,Tkey>


export interface DestinationConfig<Destination extends DestinationType>  extends MysqlConfig {
    type: Destination,
}

export interface PipelineConfig<
    TSource extends SourceType,
    TSourceMessage extends ZodObject<any>,
> {
    extractor: ExtractorConfig<TSource,TSourceMessage>
    uploaders: UploaderConf<any,TSourceMessage,any>[]

}
export interface FetchersConfig {
    environment: Environment
    sources: SourceMap,
    destinations: DestinationMap,
    redis: RedisConfig
}

export interface RedisConfig {
    url: string,
}

export class Pipeline<
TSource extends SourceType,
TSourceMessage extends ZodObject<any>
> {
    readonly extractor: ExtractorConfig<TSource,TSourceMessage>
    readonly uploaders: UploaderConf<any,TSourceMessage,any>[]

    constructor(
        conf: {
            extractor: ExtractorConfig<TSource,TSourceMessage>,
            uploaders: UploaderConf<any,NoInfer<TSourceMessage>,any>[]
        }) {
        this.extractor = conf.extractor,
        this.uploaders = conf.uploaders
    }
}
