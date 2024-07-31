const express = require('express');
const net = require('net');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const tcpPort = 25566;
const tcpHost = '127.0.0.1';

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Bun relay');
});

app.post('/send', (req, res) => {
    const message = req.body.message;

    const client = new net.Socket();
    client.connect(tcpPort, tcpHost, () => {
        console.log('Connected to Java server');
        client.write(message + '\n');
    });

    client.on('data', (data) => {
        console.log('Received from server: ' + data);
        res.send('Server response: ' + data);
        client.end();
    });

    client.on('close', () => {
        console.log('Connection closed');
    });

    client.on('error', (err) => {
        console.error('Error: ' + err.message);
        res.status(500).send('Error: ' + err.message);
    });
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
