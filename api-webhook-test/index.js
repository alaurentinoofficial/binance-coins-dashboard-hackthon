const express = require('express');
const app = express();
const cors = require('cors');
var bodyParser = require('body-parser')

// create application/json parser
var jsonParser = bodyParser.json()

app.post('/price', jsonParser, (req, res) => {
    console.log('Got body:', req.body);
    res.status(201).send('Rota POST!');
});

app.use(express.json());
app.use(cors({ origin: '*' }))
app.use(express.urlencoded({ extended: true }));
app.listen(5001);