const net = require('net');

const client = new net.Socket();
const PORT = 25566;
const HOST = '127.0.0.1';

client.connect(PORT, HOST, () => {
    console.log('Connected to server');
    setInterval(() => {
        message = "Hello from the client!\n";
        client.write(message);
        console.log(message);
    }, 2000);
});

client.on('data', (data) => {
    console.log('Received: ' + data);
});

client.on('close', () => {
    console.log('Connection closed');
});

client.on('error', (err) => {
    console.error('Error: ' + err.message);
});
