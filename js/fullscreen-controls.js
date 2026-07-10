/**
 * Toggles between active and inactive fullscreen states for the game area.
 */
function toggleFullscreen() {
    autoFullscreenEnabled = false;

    if (isFullscreenActive()) {
        setPseudoFullscreen(false);
        exitNativeFullscreen();
        updateFullscreenButton();
        return;
    }
    requestGameFullscreen({ allowPseudoFallback: true });
}

/**
 * Updates the fullscreen button icon and auto-fullscreen state flags.
 */
function updateFullscreenButton() {
    const icon = document.querySelector('#button_fullscreen img');
    const fullscreen = isFullscreenActive();

    if (icon) {
        icon.src = fullscreen ? './assets/icons/close_fullscreen.png' : './assets/icons/fullscreen.png';
    }
    if (fullscreen) {
        hasEnteredFullscreen = true;
    } else if (hasEnteredFullscreen) {
        autoFullscreenEnabled = false;
    }
}

/**
 * Requests native fullscreen and optionally falls back to pseudo-fullscreen.
 * @param {{allowPseudoFallback?: boolean}} [options={}] Fullscreen fallback behavior.
 */
function requestGameFullscreen({ allowPseudoFallback = false } = {}) {
    const element = getGameSection();
    if (!element || isFullscreenActive()) {
        return;
    }

    const fallback = () => applyPseudoFullscreenFallback(allowPseudoFallback);
    if (tryNativeFullscreen(element, fallback)) {
        return;
    }
    tryWebkitFullscreen(element, fallback);
}

/**
 * Applies pseudo-fullscreen when fallback is enabled and conditions match.
 * @param {boolean} allowPseudoFallback Whether pseudo mode is allowed.
 */
function applyPseudoFullscreenFallback(allowPseudoFallback) {
    if (!allowPseudoFallback || !shouldAutoFullscreen()) {
        return;
    }

    setPseudoFullscreen(true);
    updateFullscreenButton();
}

/**
 * Tries standard fullscreen API and wires error fallback.
 * @param {HTMLElement} element Target element.
 * @param {() => void} fallback Fallback callback when request fails.
 * @returns {boolean} True when standard API is available.
 */
function tryNativeFullscreen(element, fallback) {
    if (!element.requestFullscreen) {
        return false;
    }

    element.requestFullscreen().catch(fallback);
    return true;
}

/**
 * Tries vendor-prefixed fullscreen API and verifies activation shortly after.
 * @param {HTMLElement} element Target element.
 * @param {() => void} fallback Fallback callback when request fails.
 */
function tryWebkitFullscreen(element, fallback) {
    try {
        element.webkitRequestFullscreen?.();
        setTimeout(() => {
            if (!document.fullscreenElement) {
                fallback();
            }
        }, 150);
    } catch (e) {
        fallback();
    }
}

/**
 * Enables responsive auto-fullscreen behavior for small devices and orientation changes.
 */
function setupAutoFullscreenForSmallDevices() {
    const syncAutoFullscreen = createAutoFullscreenSyncHandler();
    syncAutoFullscreen();
    registerAutoFullscreenListeners(syncAutoFullscreen);
}

/**
 * Builds the sync handler that keeps fullscreen state aligned with device conditions.
 * @returns {() => void} Auto-fullscreen sync callback.
 */
function createAutoFullscreenSyncHandler() {
    return () => {
        if (isMobileDevice() && !isLandscape()) {
            disableFullscreenForPortraitMobile();
            return;
        }

        if (shouldAutoFullscreen()) {
            requestGameFullscreen({ allowPseudoFallback: true });
        }
    };
}

/**
 * Exits fullscreen modes when mobile device is in portrait orientation.
 */
function disableFullscreenForPortraitMobile() {
    setPseudoFullscreen(false);
    exitNativeFullscreen();
    updateFullscreenButton();
}

/**
 * Registers events that can trigger auto-fullscreen synchronization.
 * @param {() => void} syncAutoFullscreen Callback used to sync fullscreen state.
 */
function registerAutoFullscreenListeners(syncAutoFullscreen) {
    window.addEventListener('pointerdown', syncAutoFullscreen, { once: true });
    window.addEventListener('touchstart', syncAutoFullscreen, { once: true });
    window.addEventListener('orientationchange', syncAutoFullscreen);
    window.addEventListener('resize', syncAutoFullscreen);
}

/**
 * Checks whether automatic fullscreen should currently be applied.
 * @returns {boolean} True when auto-fullscreen conditions are met.
 */
function shouldAutoFullscreen() {
    return autoFullscreenEnabled && isSmallScreen() && (!isMobileDevice() || isLandscape());
}

/**
 * Detects small-screen environments by viewport and screen size.
 * @returns {boolean} True when the screen is considered small.
 */
function isSmallScreen() {
    return window.innerWidth < 750 || window.screen.width < 750 || Math.min(window.screen.width, window.screen.height) <= 900;
}

/**
 * Checks whether the current orientation is landscape.
 * @returns {boolean} True when orientation is landscape.
 */
function isLandscape() {
    return window.matchMedia('(orientation: landscape)').matches;
}

/**
 * Detects touch-first mobile-like devices.
 * @returns {boolean} True for coarse pointer devices without hover.
 */
function isMobileDevice() {
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

/**
 * Returns the main DOM element used for fullscreen presentation.
 * @returns {HTMLElement|null} The game section element.
 */
function getGameSection() {
    return document.getElementById('game_fullscreen');
}

/**
 * Enables or disables CSS-based pseudo-fullscreen mode.
 * @param {boolean} enabled Whether pseudo-fullscreen should be active.
 */
function setPseudoFullscreen(enabled) {
    const element = getGameSection();
    if (!element) {
        return;
    }
    element.classList.toggle(mobileFullscreenClass, enabled);
}

/**
 * Exits native fullscreen mode when currently active.
 */
function exitNativeFullscreen() {
    if (!document.fullscreenElement) {
        return;
    }

    if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
    } else {
        document.webkitExitFullscreen?.();
    }
}

/**
 * Checks whether native or pseudo-fullscreen is currently active.
 * @returns {boolean} True when fullscreen mode is active.
 */
function isFullscreenActive() {
    return !!document.fullscreenElement || !!getGameSection()?.classList.contains(mobileFullscreenClass);
}
