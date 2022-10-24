// const { Kafka, CompressionTypes, logLevel } = require("kafkajs")

// const clientId = "binance-app"
// const brokers = ["kafka:9091"]
// const topic = "binance_btc_price"

// const kafka = new Kafka({ 
//   // logLevel: logLevel.DEBUG,
//   clientId, 
//   brokers 
// })

// const consumer = kafka.consumer({ groupId: 'test-group' });

// const run = async () => {
//   await consumer.connect()
//   await consumer.subscribe({ topic, fromBeginning: true })
//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       console.log('HEY: ' + Buffer.from(JSON.parse(JSON.stringify(message)).value.data).toString())
//     },
//   })
// };

// run().catch(e => console.error(`[example/consumer] ${e.message}`, e))

import fromKafkaTopic from 'rxjs-kafka';
import { of, first } from 'rxjs';
import axios from 'axios';

const { message$$, pushMessage$$ } = fromKafkaTopic(
    {
        clientId: 'binance-app',
        brokers: ["kafka:9091"]
    },
    { topic: 'binance_btc_price', fromBeginning: true },
    { groupId: 'test-group' }
);

//of('Hello KafkaJS user!').subscribe(pushMessage$$);
//first()

const types = ['Price'];
const condition = ['Upper than'];

const conditions = [{
    id: 'Job 1',
    type: 'Price',
    condition: 'Upper than',
    price: 200,
    asset: 'BTCUSDT',
    webhook: 'http://api-webhook-test:5001/price'
}];

const checkConditions = (obj) => {
    let condition = conditions.filter(condition => {
        if(condition.asset == obj.s) {
            if(condition.condition == 'Upper than')
                return Number(obj.p) > condition.price;
        }

        return false;
    });

    if(typeof condition !== 'undefined') {
        condition.forEach(element => {
            axios.post(element.webhook, obj)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    }
}

message$$.pipe().subscribe(checkConditions);