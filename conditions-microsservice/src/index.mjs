import express from 'express'
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(cors({
    origin: '*'
}))

let conditionsStorage = {
    'JOB 1': {
        id: 'Job 1',
        type: 'Price',
        condition: 'Upper than',
        price: 200,
        asset: 'BTCUSDT',
        webhook: 'http://api-webhook-test:5001/price',
        logs: []
    }
};

app.get('/', (req, res) => {
    res.send(Object.values(conditionsStorage))
})

app.post('/', (req, res) => {
    let {
        id,
        type,
        condition,
        price,
        asset,
        webhook
    } = req.body;

    let data = {
        id,
        type,
        condition,
        price: Number(price),
        asset,
        webhook,
        logs: []
    };

    id = String(id).toUpperCase()
    conditionsStorage[id] = (data)
    res.send(data)
})


app.post('/log', (req, res) => {
    let {
        id,
        data
    } = req.body;

    let information = {
        id,
        data
    };

    id = String(id).toUpperCase()
    conditionsStorage[id].logs.push(information)
    res.send(information)
})

app.listen(3100, () => {
    console.log('Conditions Microsservice Listening')
})