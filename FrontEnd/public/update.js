import { initializePlayer, updatePlayer } from './player.js';
import { physics, applyMotion, sendUpdates } from './physics.js';
// import { helperKeys, initializeObject } from './helper.js';

const physicsObjects = document.getElementsByClassName('physicsObject');

document.addEventListener('DOMContentLoaded', function() {
    initializePlayer();
    // playerKeys();
    // helperKeys();
    setInterval(update, 16);
});

function update() {
    for (const physicObject of physicsObjects) {
        if (physicObject.id === 'player') {
            updatePlayer();
            physics(physicObject, physicsObjects);
            applyMotion(physicObject);
        }
        else if (!physicObject.classList.contains('arenaObject')) {
            physics(physicObject, physicsObjects);
            applyMotion(physicObject);
        }
        sendUpdates();
    }
}
