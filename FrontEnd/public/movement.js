let velocity = 0;
const gravity = 0.5;
const jumpStrength = 10;
const moveSpeed = 5;
const sprintSpeed = 15;
const friction = 0.8;
const player = document.getElementById('player');
let isJumping = false;
let jumpCount = 0;
let jumpLimit = 3;
let horizontalVelocity = 0;
let horizontalPosition = (window.innerWidth / 2) - (player.offsetWidth / 2);
const keys = {}; // pressed keys

document.addEventListener('keydown', function(event) {
    keys[event.code] = true;
    console.log(event.code);

    if (event.code === 'Space' && jumpCount < jumpLimit) {
        jumpCount++;
        velocity = -jumpStrength;
        isJumping = true;
    }
});

document.addEventListener('keyup', function(event) {
    keys[event.code] = false;
});

function isInAir() {
    return parseInt(player.style.bottom) > 0;
}

function update() {
    if (isJumping) {
        // sendData('jump');
        velocity += gravity;
        player.style.bottom = `${parseInt(player.style.bottom || 0) - velocity}px`;

        if (!isInAir()) { // landed
            player.style.bottom = '0px';
            isJumping = false;
            jumpCount = 0;
            velocity = 0;
        }
    }

    if (keys['KeyA'] && keys['KeyD']) // both keys pressed
        horizontalVelocity *= friction
    else if (keys['KeyA']) { // move left
        horizontalVelocity = -(!keys['ShiftLeft'] ? moveSpeed : sprintSpeed)
    }
    else if (keys['KeyD']) { // move right
        horizontalVelocity = (!keys['ShiftLeft'] ? moveSpeed : sprintSpeed)
    }
    else if (!isInAir()) // no keys pressed and not in air
        horizontalVelocity *= friction

    if (Math.abs(horizontalVelocity) < 0.1) // stop if velocity is too low
        horizontalVelocity = 0;

    if (Math.abs(horizontalVelocity) > sprintSpeed) // limit velocity
        horizontalVelocity = sprintSpeed * Math.sign(horizontalVelocity);

    horizontalPosition += horizontalVelocity; // update position

    if (horizontalPosition - (player.offsetWidth / 2) <= 0) { // prevent player from going out of bounds
        horizontalPosition = 0 + (player.offsetWidth / 2);
        jumpCount = 0;
    } else if (horizontalPosition >= window.innerWidth - (player.offsetWidth / 2)) { // prevent player from going out of bounds
        horizontalPosition = window.innerWidth - (player.offsetWidth / 2);
        jumpCount = 0;
    }
    
    player.style.left = `${horizontalPosition}px`;

    requestAnimationFrame(update);
}

// initial position
player.style.left = `${horizontalPosition}px`;
player.style.bottom = '0px'; 

update();