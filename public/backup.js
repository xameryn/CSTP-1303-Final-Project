let verticalVelocity = 0;
const gravity = 0.1;
const jumpStrength = 10;
const moveSpeed = 5;
const friction = 0.8;
const player = document.getElementById('player');
const physicsObjects = document.getElementsByClassName('physicsObject');
let isJumping = false;
let jumpCount = 0;
let jumpLimit = 3;
let horizontalVelocity = 0;
let horizontalPosition = (window.innerWidth / 2) - (player.offsetWidth / 2);
const keys = {}; // pressed keys

console.log(physicsObjects);

document.addEventListener('keydown', function(event) {
    keys[event.code] = true;
    console.log(event.code);

    if (event.code === 'Space' && jumpCount < jumpLimit) {
        jumpCount++;
        verticalVelocity = jumpStrength;
        console.log('jumped');
        player.style.bottom = `${parseInt(player.style.bottom || 0) + verticalVelocity}px`;
    }
});

document.addEventListener('keyup', function(event) {
    keys[event.code] = false;
});

function isInAir() {
    const playerRect = player.getBoundingClientRect();

    for (const object of physicsObjects) {
        const objectRect = object.getBoundingClientRect();
        if (playerRect.bottom >= objectRect.top && 
            playerRect.top <= objectRect.bottom && 
            playerRect.right >= objectRect.left && 
            playerRect.left <= objectRect.right) {
            // Player is on top of the object
            jumpCount = 0;
            // Adjust player position to be exactly on top of the object
            player.style.bottom = `${window.innerHeight - objectRect.top}px`;
            verticalVelocity = 0;
            return false;
        }
    }

    // Player is in the air
    verticalVelocity -= gravity;
    player.style.bottom = `${parseInt(player.style.bottom || 0) + verticalVelocity}px`;
    return true;
}

function isOnWall() {
    return parseInt(player.style.bottom) > 0;
}

function update() {
    console.log(verticalVelocity);

    if (!isInAir()) { // if not in air
        if ((keys['KeyA'] && !keys['KeyD']) || (!keys['KeyA'] && keys['KeyD'])) { // if inputting movement in 1 direction
            if ((keys['KeyD'] && horizontalVelocity < 0) || (keys['KeyA'] && horizontalVelocity > 0)) { // gradually switch directions
                horizontalVelocity *= 0.65;
            }
            else { // move in 1 direction
                horizontalVelocity = keys['KeyA'] ? -moveSpeed : moveSpeed;
                horizontalVelocity = keys['ShiftLeft'] ? horizontalVelocity * 2 : horizontalVelocity;
            }
        }
        if ((!keys['KeyA'] && !keys['KeyD']) || (keys['KeyA'] && keys['KeyD']) ) { // if not inputting movement or both keys are pressed
            horizontalVelocity *= friction;
        }
    }

    if (isInAir() && isOnWall()) { // if in air and on wall
        //todo: wall jump
    }

    if (Math.abs(horizontalVelocity) < 0.1) // stop if velocity is too low
        horizontalVelocity = 0;

    horizontalPosition += horizontalVelocity; // update position

    if (horizontalPosition - (player.offsetWidth / 2) <= 0) { // prevent player from going out of bounds
        horizontalPosition = 0 + (player.offsetWidth / 2);
        jumpCount = 0;
    } else if (horizontalPosition >= window.innerWidth - (player.offsetWidth / 2)) { // prevent player from going out of bounds
        horizontalPosition = window.innerWidth - (player.offsetWidth / 2);
        jumpCount = 0;
    }
    
    player.style.left = `${horizontalPosition}px`;
}

// initial position
player.style.left = `${horizontalPosition}px`;
player.style.bottom = '100%';

// Call update at fixed time intervals
setInterval(update, 16); // 16ms interval for roughly 60 frames per second