import {Pipeline, UploaderConf} from "./types/FetchersConfig";
import {Mt4TradeExtractor} from "../extractors/mt4/Mt4TradeExtractor";
import {CxTradeTransformer} from "../transformers/cx/CxTradeTransformer";
import {CxTradeUploader} from "../uploaders/cx/CxTradeUploader";
import {DealioTradeTransformer} from "../transformers/dealio/DealioTradeTransformer";
import {DealioTradeUploader} from "../uploaders/dealio/DealioTradeUploader";
import {config} from "./config";
import {Exchange} from "./enums/Exchange";
import {ClientExtractor} from "../extractors/backend/clients/ClientExtractor";
import { DealioClientUploader } from "../uploaders/dealio/DealioClientUploader";
import { DealioClientTransformer } from "../transformers/dealio/DealioClientTransformer";
import { clientValidator } from "../extractors/backend/clients/messages/Client";

export const pipelines: Pipeline<any, any>[] = [
    new Pipeline({
        extractor: {
            source: config.sources.backend,
            interval: 1000,
            enabled: true,
            pageSize: 3,
            implementation: ClientExtractor,
            exchange: Exchange.SSO_USERS
        },
        uploaders: [
            new UploaderConf({
                destination: config.destinations.dealio,
                transformer: new DealioClientTransformer(),
                uploader: new DealioClientUploader()
            })
        ],
    }),
    new Pipeline({
        extractor: {
            source: config.sources.real01,
            interval: 6000,
            pageSize: 500,
            enabled: false,
            exchange: Exchange.FOREX_TRADES,
            implementation: Mt4TradeExtractor
        },
        uploaders: [
            new UploaderConf({
                destination: config.destinations.cellxpertsValutaMarkets,
                transformer:  new CxTradeTransformer(),
                uploader: new CxTradeUploader()
            }),
            new UploaderConf({
                destination: config.destinations.dealio,
                transformer: new DealioTradeTransformer(),
                uploader: new DealioTradeUploader()
            })
        ],
    }),
    new Pipeline({
        extractor: {
            source: config.sources.mlReal01,
            interval: 6000,
            pageSize: 500,
            enabled: false,
            exchange: Exchange.FOREX_TRADES,
            implementation: Mt4TradeExtractor
        },
        uploaders: [
            new UploaderConf({
                destination: config.destinations.cellxpertsTauroMarkets,
                transformer:  new CxTradeTransformer(),
                uploader: new CxTradeUploader()
            }),
            new UploaderConf({
                destination: config.destinations.dealio,
                transformer: new DealioTradeTransformer(),
                uploader: new DealioTradeUploader()
            })
        ],
    }),
]
