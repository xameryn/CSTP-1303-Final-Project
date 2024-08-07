// server.js

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

const app = express();
const port = 3000;
let clientCount = 0;

// HTTP
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/send', (req, res) => {
    const message = req.body.message;
    console.log('Received message:', message);
    res.json({ status: 'success', message: 'Message received' });
});

app.get('/receive', (req, res) => {
    res.json({ status: 'success', data: 'Some data from the server' });
});

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// WEBSOCKET
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Determine the role based on the number of connected clients
    clientCount++;
    const role = clientCount === 1 ? 'player' : 'helper';
    ws.send(JSON.stringify({ role }));

    ws.on('message', (message) => {
        console.log('received: %s', message);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clientCount--; // Adjust the count when a client disconnects
    });
});

console.log('WebSocket server is running on ws://localhost:8080');

console.log('WebSocket server is running on ws://localhost:8080');