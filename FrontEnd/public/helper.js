// helper.js

const keys = {};

let dragStart = null;
let dragEnd = null;

function helperKeys() {
    document.addEventListener('mousedown', function(event) {
        event.preventDefault();
        dragStart = { x: event.clientX, y: event.clientY };
        dragEnd = null;
    });

    document.addEventListener('mouseup', function(event) {
        event.preventDefault();
        if (dragStart) {
            const currentTime = new Date().getTime();
            dragEnd = { x: event.clientX, y: event.clientY };
            let objectDim = { x: Math.min(dragStart.x, dragEnd.x), y: Math.min(dragStart.y, dragEnd.y), width: Math.abs(dragStart.x - dragEnd.x), height: Math.abs(dragStart.y - dragEnd.y) };
            if (event.button === 0) { // Left click
            initializeObject(currentTime, objectDim, 'platform');
            } else if (event.button === 2) { // Right click
                initializeObject(currentTime, objectDim, 'danger');
            } else {
                initializeObject(currentTime, objectDim, 'goal');
            }
            dragStart = null;
        }
    });

    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });
}

function checkIntersection(objectDim) {
    for (const checkObject of document.querySelectorAll('.danger, .platform, .arenaObject, .player')) {
        const checkRect = checkObject.getBoundingClientRect();

        if (objectDim.y + objectDim.height >= checkRect.top && 
            objectDim.y <= checkRect.bottom && 
            objectDim.x + objectDim.width >= checkRect.left && 
            objectDim.x <= checkRect.right) {
            return true;
        }
    }

    return false;
}

function initializeObject(objectId, objectDim, type) {
    console.log(checkIntersection(objectDim))
    if (objectDim.width > 1 && objectDim.height > 1 && !checkIntersection(objectDim)) {
        const object = document.createElement('div');
        object.id = objectId;
        object.classList.add(type);
        if (type === 'platform') {
            object.classList.add('physicsObject');
            object.classList.add('antiGravity');
        }
        document.getElementById('platform-container').appendChild(object);

        object.style.left =   `${objectDim.x}px`;
        object.style.top = `${objectDim.y}px`;
        object.style.bottom = `${parseFloat(object.style.top) - objectDim.height}px`;

        object.style.width =  `${objectDim.width}px`;
        object.style.height = `${objectDim.height}px`;

        console.log('Initialized object:', object);
    }
}

export { helperKeys, initializeObject };