import express from 'express';
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import fromKafkaTopic from 'rxjs-kafka';
import path from "path";
import axios from "axios";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);


const { message$$, pushMessage$$  } = fromKafkaTopic(
    {
        clientId: 'backend-consumer',
        brokers: ['kafka:9091']
    },
    { topic: 'aggregated_coins_price', fromBeginning: false },
    { groupId: 'backend-consumer' }
);

// message$$.subscribe(console.log);

io.on('connection', (socket) => {
    console.log('a user connected');

    message$$.subscribe(data => {
        socket.emit("agg-trade", data);
    });

    let query = {"sql":"select * from aggregated_coins_price order by partitionTs desc limit 50"};
    axios.post("http://pinot-broker:8099/query/sql", query)
        .then(r => r.data)
        .then(body => {
                let cols = body.resultTable.dataSchema.columnNames
                return body.resultTable.rows.map(row =>
                    row.reduce((a, v, i) => ({ ...a, [cols[i]]: v}), {}) 
                );
        })
        .then(body => body.forEach(x => socket.emit("agg-trade", x)))
        .catch(e => console.log(e))
});



io.on('disconnection', (socket) => {
    console.log('a user disconnected');
});


app.get('/', (req, res) => {
  res.sendFile(path.resolve() + '/src/index.html');
});

server.listen(3002, () => {
    console.log('listening on *:3002');
});