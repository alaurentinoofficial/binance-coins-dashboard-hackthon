import fromKafkaTopic from 'rxjs-kafka';
import { of, first } from 'rxjs';
import axios from 'axios';
//import  sendUpdateEmail  from "../../email_service/email_service"
const { message$$, pushMessage$$ } = fromKafkaTopic(
    {
        clientId: 'binance-app',
        brokers: ["kafka:9091"]
    },
    { topic: 'binance_btc_price', fromBeginning: true },
    { groupId: 'test-group' }
);

let conditions = [];
setInterval(() => {
    console.log('Fetching database...')
    fetch("http://conditions-microsservice:3100", {
        method: 'GET'
    }).then(async (data) => {
        conditions = await data.json(); 
        console.log(`Data loaded: ${JSON.stringify(conditions)}`)
    }).catch((e) => console.log(`Error: ${e.message}`))
}, 5000)

let logCondition = (data) => {
    let info = {
        id: data.element.id,
        data
    }
    
    fetch("http://conditions-microsservice:3100/log", {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(info)
    }).then(async (data) => {
        console.log({ log: true, info })
    }).catch((e) => console.log(`Error: ${e.message}`));
}

const checkConditions = (obj) => {
    console.log(obj);

    let condition = conditions.filter(condition => {
        let conditionFlag = false;

        if(condition.asset == obj.s) {
            if(condition.condition == 'Upper than')
                conditionFlag =  Number(obj.p) > Number(condition.price);
        }

        return conditionFlag;
    });

    if(typeof condition !== 'undefined') {
        condition.forEach(element => {
            logCondition({
                date: +(new Date),
                element,
                success: null,
                obj,
                executing: true
            })
            axios.post(element.webhook, obj)
                .then(function (response) {
                    console.log(response);
                    logCondition({
                        date: +(new Date),
                        element,
                        obj,
                        success: true,
                        executing: false,
                        response: response.data
                    })
                })
                .catch(function (error) {
                    console.log(error);
                    logCondition({
                        date: +(new Date),
                        element,
                        obj,
                        success: false,
                        executing: false,
                        error: error.message
                    })
                });
        });
    }
}

message$$.pipe().subscribe(checkConditions);