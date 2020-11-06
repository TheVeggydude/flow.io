const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4002');

ws.on('open', function open() {
    console.log('Opened connection to ws');
});

ws.on('message', (message) => {
    console.log(message);
});