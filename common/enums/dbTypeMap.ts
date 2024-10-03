import {DbTypeMap} from '../types/FetchersConfig'
import {DbType} from './DbType'

export const dbTypeMap = {
    BACKEND_DB: DbType.postgres,
    REPORTING_MT4_DB: DbType.mysql,
    CxReplica: DbType.postgres,
    DealioReplica: DbType.postgres
} as const satisfies DbTypeMap