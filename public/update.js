import { initializePlayer, updatePlayer } from './player.js';
import { physics, applyMotion, sendUpdates } from './physics.js';

// import { helperKeys, initializeObject } from './helper.js';

const physicsObjects = document.getElementsByClassName('physicsObject', 'goal');

document.addEventListener('DOMContentLoaded', function() {
    initializePlayer(); // O(1)
    // playerKeys();
    // helperKeys();
    setInterval(update, 8);
});

function update() { // O(n^2)
    for (const physicObject of physicsObjects) { // O(n)
        if (physicObject.id === 'player') {
            updatePlayer(); // O(1)
            physics(physicObject, physicsObjects); // O(n) = O(n^2)
            applyMotion(physicObject); // O(1)
        }
        else if (!physicObject.classList.contains('arenaObject')) {
            physics(physicObject, physicsObjects); // O(n) = O(n^2)
            applyMotion(physicObject); // O(1)
        }
        sendUpdates(); // O(1)
    }
}
