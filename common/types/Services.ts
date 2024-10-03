import { ZodAny, ZodObject } from "zod";
import { QueueService } from "../services/QueueService";
import { RedisService } from "../services/RedisService";
import { Service } from "./Service";

type ServiceMap = {
    [key: string]: Service
}
export interface Services  extends ServiceMap {
    redis: RedisService
}

export interface UploaderServices<T extends ZodObject<any> = ZodObject<any>>  extends ServiceMap {
    redis: RedisService,
    queue: QueueService<T>,
}