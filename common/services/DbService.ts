import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { SourceType } from "../enums/SourceType";
import { MysqlConfig, SourceConfig } from "../types/FetchersConfig";
import { Service } from "../types/Service";
import { DataSource, DataSourceOptions, QueryRunner } from "typeorm";
import { config } from "../config";
import { Environment } from "../enums/Environment";




export class DbService implements Service {
    private config: MysqlConfig;
    private dataSource: DataSource;
    private runner?: QueryRunner;
    

    constructor(conf: MysqlConfig) {
        this.config = conf
        const options : DataSourceOptions = {
            type: 'postgres',
            host: this.config.host,
            port: this.config.port,
            database: this.config.database,
            username: this.config.user,
            password: this.config.password,
            logging: config.environment === Environment.development ? 'all' : false,
            poolSize: this.config.poolSize,
        }
        this.dataSource = new DataSource(options)
    }

    async initialize(): Promise<void> {
        await this.dataSource.initialize()
        this.runner = this.dataSource.createQueryRunner()
    }

    async query(query: string, params?: any[]): Promise<unknown> {
        const result = await this.runner?.manager.query(query,params)
        return result;
    }

}