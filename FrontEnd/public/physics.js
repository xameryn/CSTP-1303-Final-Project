const gravity = 0.8;

function physics(object, physicsObjects) {
    if (handleCollisions(object, physicsObjects)[0] === false) {
        // console.log('Stopped falling due to collision');
        return;
    }
    applyGravity(object);
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
            const {minOverlap, side} = overlap;

            if (side === 'bottom' && object.dataset.verticalVelocity <= 0) { // Vertical collision - bottom
                resetVerticalVelocity(object, otherRect.top);
                isFalling = false;
            } else if (side === 'top') { // Vertical collision - top
                resetVerticalVelocity(object, otherRect.bottom - primaryRect.height);
            } else if (side === 'right' || side === 'left') { // Horizontal collision - right or left
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
        return {minOverlap, side};
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
            // console.log('Arena object collision');
            object.dataset.horizontalVelocity = 0;
        }
        else {
            let weightDif = (otherRect.width * otherRect.height) / (primaryRect.width * primaryRect.height);
            weightDif = weightDif < 1 ? 1 : weightDif;
            object.dataset.horizontalVelocity *= (1 / weightDif)
            otherObject.dataset.horizontalVelocity = object.dataset.horizontalVelocity;
            // console.log(otherObject.dataset.horizontalVelocity)
        }
    } else {
        object.dataset.isAgainstArena = true;
        // console.log('Arena object collision');
        object.dataset.horizontalVelocity = 0;
        const position = direction === 'right' ? otherRect.left - primaryRect.width : otherRect.right + primaryRect.width;
        // object.style.left = `${position}px`;
    }
    // console.log('arenaCheck: ' + object.dataset.isAgainstArena);
}

function applyMotion(object) {
    let horizontalPosition = parseFloat(object.style.left) || 0;
    if (object.dataset.horizontalVelocity == undefined) object.dataset.horizontalVelocity = 0;
    horizontalPosition += parseFloat(object.dataset.horizontalVelocity);
    object.style.left = `${horizontalPosition}px`;

    object.dataset.horizontalVelocity *= 0.8; // Apply friction

    let bottomPosition = parseFloat(object.style.bottom || 0) + parseFloat(object.dataset.verticalVelocity);
    object.style.bottom = `${bottomPosition}px`;
}


export { applyGravity, physics, handleCollisions, applyMotion };
