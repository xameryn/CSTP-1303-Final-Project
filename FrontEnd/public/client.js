// client.js

import { playerKeys } from './player.js';
import { helperKeys } from './helper.js';

let playType = null;

const socket = new WebSocket('ws://localhost:8080/');

socket.onopen = function(event) {
    console.log('Connected to WebSocket');
    window.setSocket(socket);
};

socket.onerror = function(error) {
    console.error('WebSocket error:', error);
};

socket.onmessage = function(event) {
    if (typeof event.data === 'string') {
        handleMessage(event.data);
    } else if (event.data instanceof Blob) {
        event.data.text().then(text => {
            handleMessage(text);
        }).catch(error => {
            console.error('Error reading message from server:', error);
        });
    }
};

socket.onclose = function(event) {
    console.log('Disconnected from WebSocket server');
};

function handleMessage(text) {
    try {
        const data = JSON.parse(text);
        handleServerMessage(data);
    } catch (error) {
        console.error('Error parsing message from server:', error);
    }
}

function handleServerMessage(data) {
    // console.log('Data from server:', data);
    if (data.role === 'player') {
        playerKeys();
        playType = 'player';
    } else if (data.role === 'helper') {
        helperKeys();
        playType = 'helper';
    }
    if (data.type === 'update' && data.id === 'player' && playType === 'helper') {
        document.getElementById('player').outerHTML = data.state;
    }
    if (data.type === 'update' && data.id === 'platform' && playType === 'player') {
        document.getElementById('platform-container').outerHTML = data.state;
    }
}