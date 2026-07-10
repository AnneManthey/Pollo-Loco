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

function requestGameFullscreen({ allowPseudoFallback = false } = {}) {
    const element = getGameSection();
    if (!element || isFullscreenActive()) {
        return;
    }

    const fallback = () => {
        if (allowPseudoFallback && shouldAutoFullscreen()) {
            setPseudoFullscreen(true);
            updateFullscreenButton();
        }
    };

    if (element.requestFullscreen) {
        element.requestFullscreen().catch(fallback);
        return;
    }

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

function setupAutoFullscreenForSmallDevices() {
    const syncAutoFullscreen = () => {
        if (isMobileDevice() && !isLandscape()) {
            setPseudoFullscreen(false);
            exitNativeFullscreen();
            updateFullscreenButton();
            return;
        }

        if (!shouldAutoFullscreen()) {
            return;
        }

        requestGameFullscreen({ allowPseudoFallback: true });
    };

    syncAutoFullscreen();
    window.addEventListener('pointerdown', syncAutoFullscreen, { once: true });
    window.addEventListener('touchstart', syncAutoFullscreen, { once: true });
    window.addEventListener('orientationchange', syncAutoFullscreen);
    window.addEventListener('resize', syncAutoFullscreen);
}

function shouldAutoFullscreen() {
    return autoFullscreenEnabled && isSmallScreen() && (!isMobileDevice() || isLandscape());
}

function isSmallScreen() {
    return window.innerWidth < 750 || window.screen.width < 750 || Math.min(window.screen.width, window.screen.height) <= 900;
}

function isLandscape() {
    return window.matchMedia('(orientation: landscape)').matches;
}

function isMobileDevice() {
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

function getGameSection() {
    return document.getElementById('game_fullscreen');
}

function setPseudoFullscreen(enabled) {
    const element = getGameSection();
    if (!element) {
        return;
    }
    element.classList.toggle(MOBILE_FULLSCREEN_CLASS, enabled);
}

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

function isFullscreenActive() {
    return !!document.fullscreenElement || !!getGameSection()?.classList.contains(mobileFullscreenClass);
}
