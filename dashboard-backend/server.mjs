import express from 'express';
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import fromKafkaTopic from 'rxjs-kafka';
import path from "path";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);


const { message$$, pushMessage$$  } = fromKafkaTopic(
    {
        clientId: 'backend-consumer',
        brokers: ['localhost:19091']
    },
    { topic: 'aggregated_coins_price', fromBeginning: false },
    { groupId: 'backend-consumer' }
);

message$$.subscribe(console.log);

io.on('connection', (socket) => {
    console.log('a user connected');

    message$$.subscribe(data => {
        socket.emit("agg-trade", data);
    });
});

io.on('join', (data) => {
    // TODO: Access pinot
});


io.on('disconnection', (socket) => {
    console.log('a user disconnected');
});


app.get('/', (req, res) => {
  res.sendFile(path.resolve() + '/index.html');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});