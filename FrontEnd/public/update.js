import { keyListeners, initializePlayer, updatePlayer } from './player.js';
import { applyGravity, isFalling, physics } from './physics.js';

const physicsObjects = document.getElementsByClassName('physicsObject');

function update() {
    for (const physicObject of physicsObjects) {
        if (physicObject.id === 'player') {
            updatePlayer(physicsObjects);
        } else if (!physicObject.classList.contains('arenaObject')) {
            applyGravity(physicObject);
            physics(physicObject, physicsObjects);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializePlayer();
    keyListeners();
    setInterval(update, 16);
});
