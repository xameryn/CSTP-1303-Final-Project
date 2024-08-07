// player.js

const jumpStrength = 20;
const maxJumps = 1;
const moveSpeed = 5;
const friction = 0.8;
const keys = {};
const playerElement = document.getElementById('player');
const playerData = playerElement.dataset;
const playerStyle = playerElement.style;

function playerKeys() {
    document.addEventListener('keydown', function(event) {
        keys[event.code] = true;

        if (event.code === 'Space' && playerData.jumpsRemaining > 0) {
            playerData.jumpsRemaining -= 1;
            // playerData.verticalVelocity = parseFloat(playerData.verticalVelocity) + parseFloat(jumpStrength);
            playerData.verticalVelocity = parseFloat(jumpStrength);
            // console.log('Jumped');
        }
    });

    document.addEventListener('keyup', function(event) {
        keys[event.code] = false;
    });
}

function initializePlayer() {
    playerStyle.left = `${(window.innerWidth / 2) - (playerElement.offsetWidth / 2)}px`;
    playerStyle.bottom = '50%';
    playerData.jumpStrength = 10;
    playerData.jumpsRemaining = maxJumps;
    playerData.jumpsLimit = maxJumps;
    playerData.moveSpeed = moveSpeed;
    playerData.verticalVelocity = 0;
    playerData.horizontalVelocity = 0;
}

function updatePlayer() {
    if ((keys['KeyA'] && !keys['KeyD']) || (!keys['KeyA'] && keys['KeyD'])) {
        if ((keys['KeyD'] && playerData.horizontalVelocity < 0) || (keys['KeyA'] && playerData.horizontalVelocity > 0)) {
            playerData.horizontalVelocity *= 0.65;
        } else {
            playerData.horizontalVelocity = keys['KeyA'] ? -moveSpeed : moveSpeed;
            playerData.horizontalVelocity = keys['ShiftLeft'] ? playerData.horizontalVelocity * 2 : playerData.horizontalVelocity;
        }
    } 
    // else playerData.horizontalVelocity *= friction; // Apply friction if no movement keys are pressed (moved to physics.js)

    if (Math.abs(playerData.horizontalVelocity) < 0.1) playerData.horizontalVelocity = 0; // Stop horizontal movement if velocity is low

    // Reset jump counter on ground (TODO: add to physics.js)
    // if (!handleCollisions(playerElement, physicsObjects)) playerData.jumpsRemaining = 3;
}

export { playerKeys, initializePlayer, updatePlayer };
