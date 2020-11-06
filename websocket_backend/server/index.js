const express = require('express');
const expressWebSocket = require('express-ws');
const websocketStream = require('websocket-stream/stream');
const kafka = require('kafka-node');
const Transform = require('stream').Transform;
const WebSocket = require('ws');

const app = express();
const brokers = process.env.kafka_brokers;


const messageTransform = new Transform({
    objectMode: true,
    decodeStrings: true,
    transform (message, encoding, callback) {
        callback(null, message.value);
    }
});


setTimeout(() => {


    // Setup Kafka Stream
    const client = new kafka.KafkaClient({
        kafkaHost: brokers
    });

    const consumerStream = new kafka.ConsumerStream(
        client,
        [  // Payload options (topics etc)
            { topic: process.env.kafka_topic}
        ],
        {  // Consumer options
            groupId: 'websocket_backend',
            autoCommit: false,
            fromOffset: 'latest'
        }
    );

    consumerStream.pipe(messageTransform);

    // WEBSOCKET STUFF
    // extend express app with app.ws()
    expressWebSocket(app, null, {
        // ws options here
        perMessageDeflate: false,
    });

    app.ws('/', function(ws, _) {
        // convert ws instance to stream
        const stream = websocketStream(ws, {
            // websocket-stream options here
            objectMode: true,
        });

        // Pipe the messages to the new client
        messageTransform.pipe(stream);
    });

    // Start server
    app.listen(process.env.port);
    console.log(`Listening on port ${process.env.port}`);

    // Starting a testing websocket (also flushes initial load)
    const ws = new WebSocket("ws://localhost:4002");
    ws.on('open', () => {
        console.log("Connected to own websocket, logging data...");
    });
    ws.on('message', message => {
        // console.log(message);
    });
    ws.on(`error`, error => {
        console.log(`WS error: ` + error);
    });

}, parseInt(process.env.startupTimeout));
