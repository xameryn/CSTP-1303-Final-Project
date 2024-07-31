let velocity = 0;
const gravity = 0.5;
const jumpStrength = 10;
const moveSpeed = 5;
const friction = 0.9;
const box = document.getElementById('box');
let isJumping = false;
let jumpCount = 0;
let jumpLimit = 3;
let horizontalVelocity = 0;
let horizontalPosition = (window.innerWidth / 2) - (box.offsetWidth / 2);
const keys = {}; // pressed keys

document.addEventListener('keydown', function(event) {
    keys[event.code] = true;

    if (event.code === 'Space' && jumpCount < jumpLimit) {
        jumpCount++;
        velocity = -jumpStrength;
        isJumping = true;
    }
});

document.addEventListener('keyup', function(event) {
    keys[event.code] = false;
});

function update() {
    if (isJumping) {
        // sendData('jump');
        velocity += gravity;
        box.style.bottom = `${parseInt(box.style.bottom || 0) - velocity}px`;

        if (parseInt(box.style.bottom) <= 0) { // landed
            box.style.bottom = '0px';
            isJumping = false;
            jumpCount = 0;
            velocity = 0;
        }
    }

    if (keys['KeyA'])
        horizontalVelocity = -moveSpeed
    else if (keys['KeyD'])
        horizontalVelocity =  moveSpeed
    else if (keys['KeyA'] && keys['KeyD'])
        horizontalVelocity *= friction
    else
        horizontalVelocity *= friction

    horizontalPosition += horizontalVelocity;
    box.style.left = `${horizontalPosition}px`;

    requestAnimationFrame(update);
}

// initial position
box.style.left = `${horizontalPosition}px`;
box.style.bottom = '0px'; 

update();