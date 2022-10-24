import fromKafkaTopic from 'rxjs-kafka';
import axios from 'axios';

let {
    grpc,
    calculator,
    PORT
  } = require('./lib/configuration')
  
  let readline = require('readline');
  
  let rl = readline.createInterface(process.stdin, process.stdout);
  let client = new calculator.Calculator(PORT, grpc.credentials.createInsecure());

const { message$$, pushMessage$$ } = fromKafkaTopic(
    {
        clientId: 'binance-app',
        brokers: ["kafka:9091"]
    },
    { topic: 'binance_btc_price', fromBeginning: true },
    { groupId: 'test-group' }
);

const types = ['Price'];
const condition = ['Upper than'];

// const conditions = [{
//     id: 'Job 1',
//     type: 'Price',
//     condition: 'Upper than',
//     price: 200,
//     asset: 'BTCUSDT',
//     webhook: 'http://api-webhook-test:5001/price'
// }];

const checkConditions = (obj) => {
    const conditions = client.get();
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