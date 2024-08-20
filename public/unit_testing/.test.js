// .test.js

import { JSDOM } from 'jsdom';

const dom = new JSDOM(`<!DOCTYPE html><body><div id="player"></div></body>`);
global.document = dom.window.document;
global.window = dom.window;

const { applyGravity } = require('../physics.js');
const { playerKeys, initializePlayer, updatePlayer } = require('../player.js');

// physics testing
describe('applyGravity', () => {
    test('decrease vertical velocity', () => {
        const object = { dataset: { verticalVelocity: '10' } };
        applyGravity(object);
        expect(object.dataset.verticalVelocity).toBe('9.2'); // 10 - 0.8 = 9.2
    });

    test('set vertical velocity to -0.8', () => {
        const object = { dataset: {} };
        applyGravity(object);
        expect(object.dataset.verticalVelocity).toBe('-0.8');
    });
});

// player testing
describe('player.js functions', () => {
    // let playerElement;
    // let playerData;
    // let playerStyle;

    // beforeAll(() => {
    //     // Mock the DOM element
    //     playerElement = document.getElementById('player');
    //     Object.defineProperty(playerElement, 'dataset', {
    //         value: {},
    //         writable: true
    //     });
    // });

    // beforeEach(() => {
    //     // Reset player data before each test
    //     playerData = playerElement.dataset;
    //     playerStyle = playerElement.style;
    //     playerData.jumpsRemaining = 1;
    //     playerData.verticalVelocity = 0;
    //     playerData.horizontalVelocity = 0;
    // });

    // test('initializePlayer sets initial player properties', () => {
    //     initializePlayer();

    //     expect(playerStyle.left).toBe(`${(window.innerWidth / 2) - (playerElement.offsetWidth / 2)}px`);
    //     expect(playerStyle.bottom).toBe('50%');
    //     expect(playerData.jumpStrength).toBe('10');
    //     expect(playerData.jumpsRemaining).toBe('1');
    //     expect(playerData.jumpsLimit).toBe('1');
    //     expect(playerData.moveSpeed).toBe('5');
    //     expect(playerData.verticalVelocity).toBe('0');
    //     expect(playerData.horizontalVelocity).toBe('0');
    // });
});