const gravity = 0.3;

function applyGravity(object) {
    let verticalVelocity = parseFloat(object.dataset.verticalVelocity) || 0;
    verticalVelocity -= gravity;
    object.dataset.verticalVelocity = verticalVelocity;
    object.style.bottom = `${parseInt(object.style.bottom || 0) + verticalVelocity}px`;
}

function isFalling(object, physicsObjects) {
    const objectRect = object.getBoundingClientRect();

    for (const otherObject of physicsObjects) {
        if (otherObject === object) continue;
        const otherRect = otherObject.getBoundingClientRect();

        // Check for collision
        if (objectRect.bottom >= otherRect.top &&
            objectRect.top <= otherRect.bottom &&
            objectRect.right >= otherRect.left &&
            objectRect.left <= otherRect.right) {
            
            // Stop falling
            object.dataset.verticalVelocity = 0;

            // Snap to the top of the other object if both sides of the object are intersecting with the other object
            if (objectRect.left < otherRect.right && objectRect.right > otherRect.left) {
                object.style.bottom = `${window.innerHeight - otherRect.top}px`;
            }

            // Assuming the object is positioned using 'bottom' style property
            // object.style.bottom = `${window.innerHeight - otherRect.top}px`;

            return true;
        }
    }
    return false;
}

function isCollidingWithWall(object, physicsObjects) {
    const objectRect = object.getBoundingClientRect();
    const collisions = [];

    for (const otherObject of physicsObjects) {
        if (otherObject === object) continue;
        const otherRect = otherObject.getBoundingClientRect();

        // Check for collision with the left side of the other object
        if (objectRect.right >= otherRect.left &&
            objectRect.left < otherRect.left &&
            objectRect.bottom > otherRect.top &&
            objectRect.top < otherRect.bottom) {
            
            // Stop horizontal movement
            object.dataset.horizontalVelocity = 0;

            // Snap to the left side of the other object
            object.style.left = `${otherRect.left - objectRect.width / 2}px`;

            collisions.push('left');
        }

        // Check for collision with the right side of the other object
        if (objectRect.left <= otherRect.right &&
            objectRect.right > otherRect.right &&
            objectRect.bottom > otherRect.top &&
            objectRect.top < otherRect.bottom) {
            
            // Stop horizontal movement
            object.dataset.horizontalVelocity = 0;

            // Snap to the right side of the other object
            object.style.left = `${otherRect.right + objectRect.width / 2}px`;

            collisions.push('right');
        }
    }

    console.log(collisions);

    if (collisions.includes('left') && collisions.includes('right'))
        return 'both';
    if (!collisions.includes('left') || !collisions.includes('right'))
        return null;
    else
        return collisions[0];
}


function physics(object, physicsObjects) {
    if (isFalling(object, physicsObjects)) {
        applyGravity(object);
    }

    if (isCollidingWithWall(object, physicsObjects)) {
        object.dataset.horizontalVelocity = 0;
    }
}

export { applyGravity, physics, isFalling, isCollidingWithWall };
