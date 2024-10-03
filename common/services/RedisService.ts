import redis, { RedisClientType } from 'redis'
import { RedisConfig } from '../types/FetchersConfig'
import { Service } from '../types/Service'
import { Logger } from '../utils/Logger'

// const bluebird = require('bluebird')
// bluebird.promisifyAll(redis.RedisClient.prototype)
// bluebird.promisifyAll(redis.Multi.prototype)

// let redisInstance = null

export class RedisService implements Service {

  protected config: RedisConfig
  protected client: RedisClientType
  protected logger: Logger

  constructor(config: RedisConfig) {
    this.config = config
    this.logger = new Logger(this.constructor.name)
    this.client = redis.createClient({url: config.url})
    this.client.on("error",(err) => {
        console.log("here")
        throw err;
    })
  }

  async initialize() {
    await this.client.connect()
  }


  async getValueByKey(key: string): Promise<string| null> {
    const value =  await this.client.get(key)
    return value;
  }

  async setValueByKey(key: string, value: string) {
    await this.client.set(key, value)
  }

  async setObjectByKey(key: string, value:object) {
    const json = JSON.stringify(value);
    await this.setValueByKey(key,json)
  }
  
  async getObjectByKey(key: string): Promise<unknown | null> {
    const value = await this.getValueByKey(key)
    if(!value){
      return null;
    }
    try{
      const json = JSON.parse(value);
      return json
    } catch(e: unknown){
      this.logger.error('Error parsing value from redis',e)
    }
    return null
  }

//   async safeGetValueByKey(key) {
//     let value
//     try {
//       value = await this.client.getAsync(key)
//     } catch (e) {
//       console.error('Catch safeGetValueByKey')
//       console.error(e.message)
//     }
//     return value
//   }

//   async safeSetValueByKey(key, value) {
//     try {
//       this.client.setAsync(key, value)
//     } catch (e) {
//       console.error('Catch setValueByKey')
//       console.error(e.message)
//     }
//   }

//   async deleteByKey(key: string) {
//     this.client.del(key)
//   }

//   async setExpirebyKeyAsync(key: string, value:string , expiry: string) {
//     this.client.setAsync(key, value, 'EX', expiry)
//   }

//   async setSetWithScores(setArray) {
//     await this.client.zaddAsync(setArray)
//   }

//   async deleteSetWithScoresAsync(key, score) {
//     const args = [key, '-inf', score]
//     this.client.zremrangebyscoreAsync(args)
//   }

//   async getSetValues(key) {
//     const args = [key, 0, -1]
//     return await this.client.zrangeAsync(args)
//   }

}
