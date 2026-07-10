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

function setupMobileControls() {
    mobileButtonBindings.forEach(([buttonId, key]) => {
        const button = document.getElementById(buttonId);
        if (!button) {
            return;
        }

        button.addEventListener('pointerdown', (e) => setMobileKey(e, key, true));
        button.addEventListener('pointerup', (e) => setMobileKey(e, key, false));
        button.addEventListener('pointerleave', (e) => setMobileKey(e, key, false));
        button.addEventListener('pointercancel', (e) => setMobileKey(e, key, false));
    });
}

function setMobileKey(e, key, isPressed) {
    e.preventDefault();
    if (!isGameLoaded) {
        return;
    }
    keyboard[key] = isPressed;
}

function updateKeyboardState(e, isPressed) {
    const code = e.code;
    const key = e.key;
    const keyCode = e.keyCode;

    const isGameKey = gameKeyConfig.some((config) =>
        config.codes.includes(code) || config.keys.includes(key) || config.keyCodes.includes(keyCode)
    );

    if (isGameKey) {
        e.preventDefault();
    }

    if (!isGameLoaded) {
        return;
    }

    gameKeyConfig.forEach((config) => {
        if (config.codes.includes(code) || config.keys.includes(key) || config.keyCodes.includes(keyCode)) {
            keyboard[config.stateKey] = isPressed;
        }
    });
}

window.addEventListener('keydown', (e) => {
    updateKeyboardState(e, true);
});

window.addEventListener('keyup', (e) => {
    updateKeyboardState(e, false);
});
