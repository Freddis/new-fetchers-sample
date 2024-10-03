import { config } from "./common/config";
import {pipelines} from "./common/pipelines";
import { QueueService } from "./common/services/QueueService";
import { RedisService } from "./common/services/RedisService";
import { Services, UploaderServices } from "./common/types/Services";
import { Logger } from "./common/utils/Logger";
import { UploaderRunner } from "./common/utils/UploaderRunner";

const logger = new Logger('main');
const args = process.argv
const runExtractors = args[args.length-1] === 'uploaders' ? false : true
const runUploaders = args[args.length-1] === 'extractors' ? false : true

const services: Services = {
    redis: new RedisService(config.redis)
}

const enabledPipelines = pipelines.filter(x => x.extractor.enabled)
logger.info(`Starting up, ENV=${process.env.NODE_ENV}, args: `, {runExtractors,runUploaders})

if(runExtractors){
    logger.info("Running extactors")
    for(const pipeline of enabledPipelines){
        const extractor = new pipeline.extractor.implementation(pipeline.extractor,services)
        logger.info(`Running uploaders for extractor: ${extractor.getName()}`);
        extractor.start()
    }
}

if(runUploaders){
    logger.info("Running uploaders")
    for(const pipeline of enabledPipelines){
        const extractor = new pipeline.extractor.implementation(pipeline.extractor,services)
        logger.info(`Running uploaders for extractor: ${extractor.getName()}`);
        for(const uploaderConfig of pipeline.uploaders){
            const queue = extractor.getValidator()
            const services: UploaderServices = {
                redis: new RedisService(config.redis),
                queue: new QueueService(extractor.getValidator(),uploaderConfig.uploader.getName())
            }
            const runner = new UploaderRunner(uploaderConfig,services)
            logger.info(`Running uploader ${uploaderConfig.uploader.getName()}`)
            runner.start()
        }
    }
}
