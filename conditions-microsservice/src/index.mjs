import express from 'express'
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(cors({
    origin: '*'
}))

let conditionsStorage = [{
    id: 'Job 1',
    type: 'Price',
    condition: 'Upper than',
    price: 200,
    asset: 'BTCUSDT',
    webhook: 'http://api-webhook-test:5001/price'
}];

app.get('/', (req, res) => {
    res.send(conditionsStorage)
})

app.post('/', (req, res) => {
    const {
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
        price,
        asset,
        webhook,
    };

    conditionsStorage.push(data)
    res.send(data)
})

app.listen(3100, () => {
    console.log('Conditions Microsservice Listening')
})