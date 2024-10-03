import {DbTypeMap, DestinationMap, FetchersConfig, Pipeline, SourceMap, UploaderConf,} from "./types/FetchersConfig";
import {SourceType} from "./enums/SourceType";
import {DestinationType} from "./enums/DestinationType";
import { SourceName } from "./enums/SourceName";
import { Environment } from "./enums/Environment";
import { DbType } from "./enums/DbType";


export const config  = {
    environment: Environment.development,
    sources:  {
        backend: {
            type: SourceType.BACKEND_DB,
            key: SourceName.backend,
            host: 'postgres.local',
            database: 'bdswiss',
            port: 6432,
            user: 'postgres',
            password: 'password',
            schema: 'sso',
            poolSize: 1
        },
        real01: {
            type: SourceType.REPORTING_MT4_DB,
            key: SourceName.real01,
            database: 'reports1_vm',
            host: 'postgres.local',
            port: 123,
            user: 'dasda',
            password: 'dasd',
            schema: 'dasd',
            poolSize: 3
        },
        mlReal01: {
            type: SourceType.REPORTING_MT4_DB,
            key: SourceName.mlReal01,
            database: 'reports1_vm',
            host: 'postgres.local',
            port: 123,
            user: 'dasda',
            password: 'dasd',
            schema: 'dasd',
            poolSize: 3
        },
    },
    destinations: {
        cellxpertsTauroMarkets: {
            type: DestinationType.CxReplica,
            database: 'reports1_vm',
            host: 'postgres.local',
            port: 123,
            user: 'dasda',
            password: 'dasd',
            poolSize: 3
        },
        cellxpertsValutaMarkets: {
            type: DestinationType.CxReplica,
            database: 'reports1_vm',
            host: 'postgres.local',
            port: 123,
            user: 'dasda',
            password: 'dasd',
            poolSize: 3
        },
        dealio: {
            type: DestinationType.DealioReplica,
            database: 'postgres',
            host: 'postgres.local',
            port: 6432,
            user: 'postgres',
            password: 'password',
            poolSize: 3
        }
    },
    redis: {
        url: 'redis://redis.local:7379',
    },
} as const satisfies FetchersConfig
