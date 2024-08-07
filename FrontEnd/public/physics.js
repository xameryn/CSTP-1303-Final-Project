let previousPlayerState = '';
let previousPlatformsState = '';

const gravity = 0.8;

function physics(object, physicsObjects) {
    if (shouldApplyGravity(object, physicsObjects)) {
        applyGravity(object);
    }
}

function shouldApplyGravity(object, physicsObjects) {
    return !(object.id === 'player' && handleCollisions(object, physicsObjects) === false || object.classList.contains('antiGravity'));
}

function applyGravity(object) {
    let verticalVelocity = parseFloat(object.dataset.verticalVelocity) || 0;
    verticalVelocity -= gravity;
    object.dataset.verticalVelocity = verticalVelocity;
}

function handleCollisions(object, physicsObjects) {
    const primaryRect = object.getBoundingClientRect();
    let isFalling = true;

    for (const otherObject of physicsObjects) {
        if (shouldSkipCollision(object, otherObject)) continue;

        const otherRect = otherObject.getBoundingClientRect();
        const overlap = calculateOverlap(primaryRect, otherRect);

        if (overlap) {

            if (object.id === 'player' && otherObject.classList.contains('goal')) { // fix awaiting first confirmation

                const platformContainer = document.getElementById('platform-container');
                while (platformContainer.firstChild) {
                    platformContainer.removeChild(platformContainer.firstChild);
                }

                object.dispatchEvent(new KeyboardEvent('keyup')); // not working

                document.getElementById('title').textContent = 'You Win!';
                setTimeout(() => {
                    document.getElementById('title').textContent = 'Welcome to Buddy Hop';
                }, 5000);

                object.dataset.horizontalVelocity = 0;
                object.dataset.verticalVelocity = 0;
                object.style.left = '50%';

                // window.alert('Goal reached');
            }

            const { minOverlap, side } = overlap;

            if (side === 'bottom' && object.dataset.verticalVelocity <= 0) { // bottom collision
                resetVerticalVelocity(object, otherRect.top);
                isFalling = false;
                if (object.id === 'player') object.dataset.jumpsRemaining = object.dataset.jumpsLimit;
            } else if (side === 'top') {
                if (object.id === 'player') object.dataset.verticalVelocity = 0;
            } else if (side === 'right' || side === 'left') {
                handleHorizontalCollision(object, otherObject, side, primaryRect, otherRect);
            }
        }
    }

    return isFalling;
}

function shouldSkipCollision(object, otherObject) {
    return (
        otherObject === object ||
        otherObject.id === 'player' ||
        (object.classList.contains('arenaObject') && otherObject.classList.contains('arenaObject'))
    );
}

function calculateOverlap(primaryRect, otherRect) {
    const overlapBottom = primaryRect.bottom - otherRect.top;
    const overlapTop = otherRect.bottom - primaryRect.top;
    const overlapRight = primaryRect.right - otherRect.left;
    const overlapLeft = otherRect.right - primaryRect.left;

    const minOverlap = Math.min(overlapBottom, overlapTop, overlapRight, overlapLeft);
    const side = minOverlap === overlapBottom ? 'bottom' :
                 minOverlap === overlapTop ? 'top' :
                 minOverlap === overlapRight ? 'right' : 'left';

    if (primaryRect.bottom >= otherRect.top &&
        primaryRect.top <= otherRect.bottom &&
        primaryRect.right >= otherRect.left &&
        primaryRect.left <= otherRect.right) {
        return { minOverlap, side };
    }
    return null;
}

function resetVerticalVelocity(object, position) {
    object.dataset.verticalVelocity = 0;
    object.style.bottom = `${window.innerHeight - position}px`;
}

function handleHorizontalCollision(object, otherObject, side, primaryRect, otherRect) {
    if (side === 'right' && object.dataset.horizontalVelocity >= 0) {
        handlePushOrStop(object, otherObject, primaryRect, otherRect, 'right');
    } else if (side === 'left' && object.dataset.horizontalVelocity <= 0) {
        handlePushOrStop(object, otherObject, primaryRect, otherRect, 'left');
    }
}

function handlePushOrStop(object, otherObject, primaryRect, otherRect, direction) {
    if (!otherObject.classList.contains('arenaObject')) {
        object.dataset.isAgainstArena = false;
        if (otherObject.dataset.isAgainstArena) {
            object.dataset.horizontalVelocity = 0;
        } else {
            let weightDif = (otherRect.width * otherRect.height) / (primaryRect.width * primaryRect.height);
            weightDif = weightDif < 1 ? 1 : weightDif;
            object.dataset.horizontalVelocity *= (1 / weightDif);
            otherObject.dataset.horizontalVelocity = object.dataset.horizontalVelocity;
        }
    } else {
        object.dataset.isAgainstArena = true;
        object.dataset.horizontalVelocity = 0;
        const position = direction === 'right' ? otherRect.left - primaryRect.width : otherRect.right + primaryRect.width;
    }
}

function applyMotion(object) {
    let horizontalPosition = parseFloat(object.style.left) || 0;
    if (object.dataset.horizontalVelocity === undefined) object.dataset.horizontalVelocity = 0;
    horizontalPosition += parseFloat(object.dataset.horizontalVelocity);
    object.style.left = `${horizontalPosition}px`;

    object.dataset.horizontalVelocity *= 0.8; // Apply friction

    let bottomPosition = parseFloat(object.style.bottom || 0) + parseFloat(object.dataset.verticalVelocity);
    object.style.bottom = `${bottomPosition}px`;
}

function sendUpdates() {
    const playerElement = document.getElementById('player');
    const playerState = playerElement.outerHTML;

    const platformContainer = document.getElementById('platform-container');
    const platformState = platformContainer.outerHTML;

    if (window.socket && window.socket.readyState === WebSocket.OPEN) {
        if (playerState !== previousPlayerState) {
            const playerMessage = {
                type: 'update',
                id: 'player',
                state: playerState
            };
            window.socket.send(JSON.stringify(playerMessage));
            previousPlayerState = playerState;
        }

        if (platformState !== previousPlatformsState) {
            const platformMessage = {
                type: 'update',
                id: 'platform',
                state: platformState
            };
            window.socket.send(JSON.stringify(platformMessage));
            previousPlatformsState = platformState;
        }
    }
}

export { applyGravity, physics, handleCollisions, applyMotion, sendUpdates };
