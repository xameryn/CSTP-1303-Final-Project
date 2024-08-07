import { playerKeys, initializePlayer, updatePlayer } from './player.js';
import { helperKeys, initializeObject } from './helper.js';
import { physics, applyMotion } from './physics.js';

const physicsObjects = document.getElementsByClassName('physicsObject');

document.addEventListener('DOMContentLoaded', function() {
    initializePlayer();
    // initializeObject('box', 200, 100, 200, 100);
    playerKeys();
    helperKeys();
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
    }
}
