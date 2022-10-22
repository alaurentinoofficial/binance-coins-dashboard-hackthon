const { Kafka, CompressionTypes, logLevel } = require("kafkajs")

const clientId = "binance-app"
const brokers = ["apache-kafka-broker:9092"]
const topic = "message-log"

const kafka = new Kafka({ 
  logLevel: logLevel.DEBUG,
  clientId, 
  brokers 
})

const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        consumerMessage: true,
        topic,
        partition,
        message
      })
    },
  })
};

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))