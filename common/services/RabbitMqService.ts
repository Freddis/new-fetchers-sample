// import  amqp  from 'amqp-connection-manager'

// let amqpInstance = null
// export class AmqpClient {
//   constructor(config, logger, bugsnag, redis) {
//     this.config = config
//     this.logger = logger
//     this.bugsnag = bugsnag
//     this.connection = this._createConnection(this.config.rabbit.host, this.config.rabbit.retryConnectionOptions)
//     this.channel = this.getChannelAsync()
//     this.reconnectionAttempts = 0
//     this.redis = redis
//   }

//   static get instance() {
//     if (!amqpInstance) {
//       amqpInstance = new AmqpClient()
//     }

//     return amqpInstance
//   }

//   static setup(config, logger, bugsnag, redis) {
//     amqpInstance = new AmqpClient(config, logger, bugsnag, redis)
//   }

//   async _createConnection(url, retryConnectionOptions) {
//     const RECONNECT_RABBITMQ = 'reconnect_rabbitmq_skyground_fetchers'
//     return amqp.connect(url)
//       .on('connectFailed', async () => {
//         const {initialInterval, finalInterval, attemptsToIncreaseInterval} = retryConnectionOptions
//         this.connection.reconnectTimeInSeconds = Math.min(initialInterval
//           + Math.floor(this.reconnectionAttempts++ / attemptsToIncreaseInterval)
//           * initialInterval, finalInterval)

//         this.logger.info(`[services:rabbitmq] Failed to connect. The next reconnection attempt will be in ${this.connection.reconnectTimeInSeconds} sec.`)
//         await this.redis.safeSetValueByKey(RECONNECT_RABBITMQ, JSON.stringify({ disconnect: new Date(Date.now()).toISOString() }))
//       })
//       .on('connect', async () => {
//         this.connection.reconnectTimeInSeconds = retryConnectionOptions.initialInterval
//         this.reconnectionAttempts = 0
//         this.logger.info(`[services:rabbitmq] Successful to connect.`)
//         let jsonObject = await this.redis.safeGetValueByKey(RECONNECT_RABBITMQ)
//         let {disconnect} = jsonObject ? this.safeParseJSON(jsonObject) : {disconnect: ''}
//         await this.redis.safeSetValueByKey(RECONNECT_RABBITMQ,
//             JSON.stringify({disconnect, reconnect: new Date(Date.now()).toISOString()}))
//       })
//   }

//   async getChannelAsync() {
//     return (await this.connection).createChannel()
//   }

//   async assertExchangeAsync(params) {
//     const {name, type, options} = {...params}
//     return (await this.channel).assertExchange(name, type, options)
//   }

//   async assertQueueAsync(queueParams) {
//     const {params} = {...queueParams}
//     return (await this.channel).assertQueue(params.name, params.options)
//   }

//   async exchangeQueueBindingsAsync(bindingParams) {
//     const {params} = {...bindingParams}
//     return (await this.channel).bindQueue(params.queue, params.source, params.pattern)
//   }

//   async publishToExchangeAsync(channel, publishParams) {
//     const {params} = {...publishParams}
//     return channel.publish(params.exchange, params.rootingKey, Buffer.from(params.payload), {...params.options})
//   }

//   async subscribeToQueueAsync(channel, queue, processors, prefetchCount) {
//     channel.consume(queue, message => {
//       try {
//         Promise.map(processors, async (processor) => {
//           let msg = JSON.parse(message.content)
//           console.log('hereeeee', JSON.stringify(JSON.parse(message.content)))
//           console.log('processor name', processor.name, processor.type)
//           return processor.processor.process(msg, processor.validator, processor.mapper, processor.dispatcher, processor.type)
//         }).then(() => {
//           // console.log('finish', JSON.stringify(JSON.parse(message.content)))
//           channel.ack(message)
//         }).catch((e) => {
//           this.logger.error('CAUGHT ERROR IN RABBIT MQ NACK', e)
//           console.log(e)
//           console.log('Error processing', JSON.parse(message.content))
//           this.bugsnag.reportError(new Error(e))
//           channel.nack(message)
//         })
//       } catch (e) {
//         console.log('hereee unack', JSON.stringify(JSON.parse(message.content)), e)
//         this.logger.error('CAUGHT ERROR IN RABBIT MQ', e)
//         this.bugsnag.reportError(new Error(e))
//         channel.nack(message)
//       }
//     }, {prefetch: prefetchCount})
//   }

//   safeParseJSON(s) {
//     try {
//       return JSON.parse(s)
//     } catch (e) {
//       return s
//     }
//   }
// }
