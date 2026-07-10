const gameKeyConfig = [
    { stateKey: 'RIGHT', codes: ['ArrowRight'], keys: ['ArrowRight', 'Right'], keyCodes: [39] },
    { stateKey: 'LEFT', codes: ['ArrowLeft'], keys: ['ArrowLeft', 'Left'], keyCodes: [37] },
    { stateKey: 'UP', codes: ['ArrowUp'], keys: ['ArrowUp', 'Up'], keyCodes: [38] },
    { stateKey: 'DOWN', codes: ['ArrowDown'], keys: ['ArrowDown', 'Down'], keyCodes: [40] },
    { stateKey: 'SPACE', codes: ['Space'], keys: [' ', 'Spacebar'], keyCodes: [32] },
    { stateKey: 'D', codes: ['KeyD'], keys: ['d', 'D'], keyCodes: [68] }
];

const mobileButtonBindings = [
    ['button_right', 'RIGHT'],
    ['button_left', 'LEFT'],
    ['button_jump', 'UP'],
    ['button_throw', 'D']
];

/**
 * Registers pointer controls for mobile action buttons.
 */
function setupMobileControls() {
    mobileButtonBindings.forEach(([buttonId, key]) => registerMobileButtonEvents(buttonId, key));
}

/**
 * Binds pointer events of one mobile button to one keyboard state key.
 * @param {string} buttonId DOM id of the control button.
 * @param {string} key Keyboard state key to update.
 */
function registerMobileButtonEvents(buttonId, key) {
    const button = document.getElementById(buttonId);
    if (!button) {
        return;
    }

    button.addEventListener('pointerdown', (e) => setMobileKey(e, key, true));
    button.addEventListener('pointerup', (e) => setMobileKey(e, key, false));
    button.addEventListener('pointerleave', (e) => setMobileKey(e, key, false));
    button.addEventListener('pointercancel', (e) => setMobileKey(e, key, false));
}

/**
 * Updates one mobile key state when a touch/pointer event occurs.
 * @param {PointerEvent} e Pointer event from the control button.
 * @param {string} key Keyboard state key to update.
 * @param {boolean} isPressed Whether the key should be pressed.
 */
function setMobileKey(e, key, isPressed) {
    e.preventDefault();
    if (!isGameLoaded) {
        return;
    }
    keyboard[key] = isPressed;
}

/**
 * Maps keyboard events to in-game key states.
 * @param {KeyboardEvent} e Keyboard event to evaluate.
 * @param {boolean} isPressed Whether the key state is pressed.
 */
function updateKeyboardState(e, isPressed) {
    const keyData = getKeyboardEventData(e);
    if (isConfiguredGameKey(keyData)) {
        e.preventDefault();
    }
    if (!isGameLoaded) {
        return;
    }

    applyKeyboardState(keyData, isPressed);
}

/**
 * Extracts key properties needed by the key config matcher.
 * @param {KeyboardEvent} e Keyboard event to read.
 * @returns {{code: string, key: string, keyCode: number}} Normalized key data.
 */
function getKeyboardEventData(e) {
    return { code: e.code, key: e.key, keyCode: e.keyCode };
}

/**
 * Checks whether key data belongs to one configured game control.
 * @param {{code: string, key: string, keyCode: number}} keyData Normalized key data.
 * @returns {boolean} True when key data matches game controls.
 */
function isConfiguredGameKey(keyData) {
    return gameKeyConfig.some((config) => matchesGameKeyConfig(config, keyData));
}

/**
 * Applies pressed/released state to all matching game key mappings.
 * @param {{code: string, key: string, keyCode: number}} keyData Normalized key data.
 * @param {boolean} isPressed Whether matching controls should be pressed.
 */
function applyKeyboardState(keyData, isPressed) {
    gameKeyConfig.forEach((config) => {
        if (matchesGameKeyConfig(config, keyData)) {
            keyboard[config.stateKey] = isPressed;
        }
    });
}

/**
 * Checks whether one key mapping matches current key data.
 * @param {{stateKey: string, codes: string[], keys: string[], keyCodes: number[]}} config One key config entry.
 * @param {{code: string, key: string, keyCode: number}} keyData Normalized key data.
 * @returns {boolean} True when the mapping matches.
 */
function matchesGameKeyConfig(config, keyData) {
    return config.codes.includes(keyData.code)
        || config.keys.includes(keyData.key)
        || config.keyCodes.includes(keyData.keyCode);
}

window.addEventListener('keydown', (e) => {
    updateKeyboardState(e, true);
});

window.addEventListener('keyup', (e) => {
    updateKeyboardState(e, false);
});
