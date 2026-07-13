/**
 * Holds current keyboard input state used by the game loop.
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;

    gameKeyConfig = [
        { stateKey: 'RIGHT', codes: ['ArrowRight'], keys: ['ArrowRight', 'Right'], keyCodes: [39] },
        { stateKey: 'LEFT', codes: ['ArrowLeft'], keys: ['ArrowLeft', 'Left'], keyCodes: [37] },
        { stateKey: 'UP', codes: ['ArrowUp'], keys: ['ArrowUp', 'Up'], keyCodes: [38] },
        { stateKey: 'DOWN', codes: ['ArrowDown'], keys: ['ArrowDown', 'Down'], keyCodes: [40] },
        { stateKey: 'SPACE', codes: ['Space'], keys: [' ', 'Spacebar'], keyCodes: [32] },
        { stateKey: 'D', codes: ['KeyD'], keys: ['d', 'D'], keyCodes: [68] }
    ];

    mobileButtonBindings = [
        ['button_right', 'RIGHT'],
        ['button_left', 'LEFT'],
        ['button_jump', 'UP'],
        ['button_throw', 'D']
    ];

    /**
     * @param {() => boolean} isInputEnabled Callback that indicates when input should be applied.
     */
    constructor(isInputEnabled = () => true) {
        this.isInputEnabled = isInputEnabled;
    }

    /**
     * Registers all keyboard and touch controls.
     */
    initializeControls() {
        this.bindKeyboardEvents();
        this.bindMobileButtons();
    }

    /**
     * Registers pointer controls for mobile action buttons.
     */
    bindMobileButtons() {
        this.mobileButtonBindings.forEach(([buttonId, key]) => this.registerMobileButtonEvents(buttonId, key));
    }

    /**
     * Binds pointer events of one mobile button to one keyboard state key.
     * @param {string} buttonId DOM id of the control button.
     * @param {string} key Keyboard state key to update.
     */
    registerMobileButtonEvents(buttonId, key) {
        const button = document.getElementById(buttonId);
        if (!button) {
            return;
        }
        button.addEventListener('pointerdown', (e) => this.setMobileKey(e, key, true));
        button.addEventListener('pointerup', (e) => this.setMobileKey(e, key, false));
        button.addEventListener('pointerleave', (e) => this.setMobileKey(e, key, false));
        button.addEventListener('pointercancel', (e) => this.setMobileKey(e, key, false));
    }

    /**
     * Updates one mobile key state when a touch/pointer event occurs.
     * @param {PointerEvent} e Pointer event from the control button.
     * @param {string} key Keyboard state key to update.
     * @param {boolean} isPressed Whether the key should be pressed.
     */
    setMobileKey(e, key, isPressed) {
        e.preventDefault();
        if (!this.isInputEnabled()) {
            return;
        }
        this[key] = isPressed;
    }

    /**
     * Registers global keydown/keyup listeners.
     */
    bindKeyboardEvents() {
        window.addEventListener('keydown', (e) => this.updateKeyboardState(e, true));
        window.addEventListener('keyup', (e) => this.updateKeyboardState(e, false));
    }

    /**
     * Maps keyboard events to in-game key states.
     * @param {KeyboardEvent} e Keyboard event to evaluate.
     * @param {boolean} isPressed Whether the key state is pressed.
     */
    updateKeyboardState(e, isPressed) {
        const keyData = this.getKeyboardEventData(e);
        if (this.isConfiguredGameKey(keyData)) {
            e.preventDefault();
        }
        if (!this.isInputEnabled()) {
            return;
        }
        this.applyKeyboardState(keyData, isPressed);
    }

    /**
     * Extracts key properties needed by the key config matcher.
     * @param {KeyboardEvent} e Keyboard event to read.
     * @returns {{code: string, key: string, keyCode: number}} Normalized key data.
     */
    getKeyboardEventData(e) {
        return { code: e.code, key: e.key, keyCode: e.keyCode };
    }

    /**
     * Checks whether key data belongs to one configured game control.
     * @param {{code: string, key: string, keyCode: number}} keyData Normalized key data.
     * @returns {boolean} True when key data matches game controls.
     */
    isConfiguredGameKey(keyData) {
        return this.gameKeyConfig.some((config) => this.matchesGameKeyConfig(config, keyData));
    }

    /**
     * Applies pressed/released state to all matching game key mappings.
     * @param {{code: string, key: string, keyCode: number}} keyData Normalized key data.
     * @param {boolean} isPressed Whether matching controls should be pressed.
     */
    applyKeyboardState(keyData, isPressed) {
        this.gameKeyConfig.forEach((config) => {
            if (this.matchesGameKeyConfig(config, keyData)) {
                this[config.stateKey] = isPressed;
            }
        });
    }

    /**
     * Checks whether one key mapping matches current key data.
     * @param {{stateKey: string, codes: string[], keys: string[], keyCodes: number[]}} config One key config entry.
     * @param {{code: string, key: string, keyCode: number}} keyData Normalized key data.
     * @returns {boolean} True when the mapping matches.
     */
    matchesGameKeyConfig(config, keyData) {
        return config.codes.includes(keyData.code)
            || config.keys.includes(keyData.key)
            || config.keyCodes.includes(keyData.keyCode);
    }
}