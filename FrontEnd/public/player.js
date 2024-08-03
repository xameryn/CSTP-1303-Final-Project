import { applyGravity, isFalling, isCollidingWithWall } from './physics.js';

const jumpStrength = 10;
const moveSpeed = 5;
const friction = 0.8;
const keys = {};
const playerElement = document.getElementById('player');

function keyListeners() {
    document.addEventListener('keydown', function(event) {
        keys[event.code] = true;

        if (event.code === 'Space' && playerElement.dataset.jumpsRemaining > 0) {
            playerElement.dataset.jumpsRemaining -= 1;
            playerElement.dataset.verticalVelocity = jumpStrength;
        }
    });

    document.addEventListener('keyup', function(event) {
        keys[event.code] = false;
    });
}

function updatePlayer(physicsObjects) {
    let verticalVelocity = parseFloat(playerElement.dataset.verticalVelocity) || 0;
    let horizontalVelocity = parseFloat(playerElement.dataset.horizontalVelocity) || 0;
    let horizontalPosition = parseFloat(playerElement.dataset.horizontalPosition) || (window.innerWidth / 2) - (playerElement.offsetWidth / 2);
    let collisionSide = isCollidingWithWall(playerElement, physicsObjects);

    if ((keys['KeyA'] && !keys['KeyD']) || (!keys['KeyA'] && keys['KeyD'])) {
        if ((keys['KeyD'] && horizontalVelocity < 0) || (keys['KeyA'] && horizontalVelocity > 0)) {
            horizontalVelocity *= 0.65;
        } else {
            horizontalVelocity = keys['KeyA'] ? -moveSpeed : moveSpeed;
            horizontalVelocity = keys['ShiftLeft'] ? horizontalVelocity * 2 : horizontalVelocity;
        }
    } else {
        horizontalVelocity *= friction;
    }

    if (Math.abs(horizontalVelocity) < 0.1) {
        horizontalVelocity = 0;
    }

    // Handle collision with walls

    if (isCollidingWithWall(playerElement, physicsObjects)) {
        horizontalVelocity = 0;
        console.log('colliding with wall');
    }



    // if (horizontalPosition - (playerElement.offsetWidth / 2) <= 0) {
    //     horizontalPosition = 0 + (playerElement.offsetWidth / 2);
    //     playerElement.dataset.jumpsRemaining = 3;
    // } else if (horizontalPosition >= window.innerWidth - (playerElement.offsetWidth / 2)) {
    //     horizontalPosition = window.innerWidth - (playerElement.offsetWidth / 2);
    //     playerElement.dataset.jumpsRemaining = 3;
    // }

    // if (collisionObject) { // if colliding with wall
    //     if (horizontalVelocity > 0) { // Moving right
    //         playerElement.style.left = `${collisionObject.left - playerElement.offsetWidth}px`;
    //     } else if (horizontalVelocity < 0) { // Moving left
    //         playerElement.style.left = `${collisionObject.right}px`;
    //     }
    //     horizontalVelocity = 0;
    // }

    horizontalPosition += horizontalVelocity;

    playerElement.style.left = `${horizontalPosition}px`;
    playerElement.style.bottom = `${parseInt(playerElement.style.bottom || 0) + verticalVelocity}px`;
    playerElement.dataset.horizontalPosition = horizontalPosition;
    playerElement.dataset.horizontalVelocity = horizontalVelocity;

    // Handle collision with physics objects
    if (isFalling(playerElement, physicsObjects)) {
        verticalVelocity = 0;
        playerElement.dataset.verticalVelocity = 0;
        playerElement.dataset.jumpsRemaining = 3;
    } else {
        applyGravity(playerElement);
    }

    
}

function initializePlayer() {
    playerElement.style.left = `${(window.innerWidth / 2) - (playerElement.offsetWidth / 2)}px`;
    playerElement.style.bottom = '50%';
    playerElement.dataset.jumpsRemaining = 3;
    playerElement.dataset.verticalVelocity = 0;
    playerElement.dataset.horizontalVelocity = 0;
    playerElement.dataset.horizontalPosition = (window.innerWidth / 2) - (playerElement.offsetWidth / 2);
}

export { keyListeners, initializePlayer, updatePlayer };
