const { Spot } = require('@binance/connector')
const { Kafka, CompressionTypes, logLevel } = require("kafkajs")

const clientId = "binance-app"
const brokers = ["apache-kafka-broker:9092"]
const topic = "message-log"

const kafka = new Kafka({ 
  logLevel: logLevel.DEBUG,
  clientId, 
  brokers 
})

const producer = kafka.producer()

const client = new Spot('', '')

const callbacks = {
  open: async () => {
    client.logger.log('open')
  },
  close: () => client.logger.log('closed'),
  message: async (data) => {
    try {
      let messageData = {
        value: JSON.stringify(data),
      };

      client.logger.log(messageData)
      
			await producer.send({
				topic,
				messages: [messageData],
			})
		} catch (err) {
			console.error("could not write message " + err)
		}
  }
}

const aggTrade = client.aggTradeWS('bnbusdt', callbacks)

// support combined stream
const combinedStreams = client.combinedStreams(['btcusdt@miniTicker', 'ethusdt@ticker'], callbacks);

(async function () {
  await producer.connect()
})();