/**
 * Toggles between active and inactive fullscreen states for the game area.
 */
function toggleFullscreen() {
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
    if (!allowPseudoFallback) {
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
