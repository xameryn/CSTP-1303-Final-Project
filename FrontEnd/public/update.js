import { keyListeners, initializePlayer, updatePlayer } from './player.js';
import { physics, applyMotion } from './physics.js';

const physicsObjects = document.getElementsByClassName('physicsObject');

document.addEventListener('DOMContentLoaded', function() {
    initializePlayer();
    keyListeners();
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
