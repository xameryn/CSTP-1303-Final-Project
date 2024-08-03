const gravity = 0.8;

function physics(object, physicsObjects) {
    if (!handleCollisions(object, physicsObjects)) {
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
        if (otherObject === object) continue;
        if (object.classList.contains('arenaObject') && otherObject.classList.contains('arenaObject')) continue;
        if (otherObject.id === 'player') continue;

        const otherRect = otherObject.getBoundingClientRect();

        if (primaryRect.bottom >= otherRect.top && // Object is below other object
            primaryRect.top <= otherRect.bottom && // Object is above other object
            primaryRect.right >= otherRect.left && // Object is to the right of other object
            primaryRect.left <= otherRect.right) { // Object is to the left of other object

            const overlapBottom = primaryRect.bottom - otherRect.top;
            const overlapTop = otherRect.bottom - primaryRect.top;
            const overlapRight = primaryRect.right - otherRect.left;
            const overlapLeft = otherRect.right - primaryRect.left;

            const minOverlap = Math.min(overlapBottom, overlapTop, overlapRight, overlapLeft);

            // console.log(`Collision detected. Min overlap: ${minOverlap}, overlaps: B(${overlapBottom}), T(${overlapTop}), R(${overlapRight}), L(${overlapLeft})`);

            if (minOverlap === overlapBottom) { // Handle vertical collision - bottom face
                if (object.dataset.verticalVelocity <= 0) {
                    if (object.id === 'player') object.dataset.jumpsRemaining = object.dataset.jumpsLimit;
                    object.dataset.verticalVelocity = 0;
                    object.style.bottom = `${window.innerHeight - otherRect.top}px`;
                }
                isFalling = false;
            } else if (minOverlap === overlapTop) { // Handle vertical collision - top face
                object.dataset.verticalVelocity = 0;
                object.style.bottom = `${window.innerHeight - otherRect.bottom - primaryRect.height}px`;
            } else if (minOverlap === overlapRight) { // Handle horizontal collision - right face
                if (object.dataset.horizontalVelocity >= 0) {
                    if (!otherObject.classList.contains('arenaObject')) { // push non-arena objects
                        otherObject.style.left = `${parseFloat(object.dataset.horizontalPosition) + parseFloat(primaryRect.width)}px`;
                    }
                    else {
                        object.dataset.horizontalVelocity = 0;
                        object.style.left = `${otherRect.left - primaryRect.width}px`;
                    }
                }
            } else if (minOverlap === overlapLeft) { // Handle horizontal collision - left face
                if (object.dataset.horizontalVelocity <= 0) {
                    if (!otherObject.classList.contains('arenaObject')) { // push non-arena objects
                        otherObject.style.left = `${parseFloat(object.dataset.horizontalPosition) - parseFloat(primaryRect.width)}px`;
                    }
                    else {
                        object.dataset.horizontalVelocity = 0;
                        object.style.left = `${otherRect.right}px`;
                    }
                }
            }
        }
    }

    return isFalling;
}

function applyMotion(object) {
    object.dataset.horizontalPosition = parseFloat(object.dataset.horizontalPosition) + parseFloat(object.dataset.horizontalVelocity);

    object.style.left = `${object.dataset.horizontalPosition}px`;
    object.style.bottom = `${parseFloat(object.style.bottom || 0) + parseFloat(object.dataset.verticalVelocity)}px`;
}

export { applyGravity, physics, handleCollisions, applyMotion };
