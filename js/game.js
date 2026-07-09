let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = localStorage.getItem('isMuted') === 'true';
let isMusicMuted = localStorage.getItem('isMusicMuted') === 'true';
let isGameLoaded = false;
let autoFullscreenEnabled = true;
let hasEnteredFullscreen = false;
let game_over_sound = new Audio('assets/sounds/game/gameOver.ogg');
let game_won_sound = new Audio('assets/sounds/game/gameWon.ogg');
let background_music = new Audio('assets/sounds/game/backgroundMusic.ogg');
const storyInfos = [
    "Story: Pepe ist tief in die Wüste gereist, um die gestohlenen Salsa-Flaschen zurückzuholen...",
    "Tipp: Drücke 'D', um eine Salsa-Flasche auf die Hühner zu werfen!",
    "Achtung: Kleine Küken sterben nach 1 Treffer, aber der Boss hält ganze 5 Treffer aus!",
    "Tipp: Lande präzise von oben auf den Hühnern, um automatisch wieder hochzufedern.",
    "Story: Die Hühner haben sich zusammengeschlossen, um Pepes Münzsammlung zu plündern..."
];

window.addEventListener('load', () => {
    setTimeout(hideLoadingScreen, 1500);
});

function init(){
    setRandomLoadingText();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard, openGameOverDialog);
    background_music.loop = true;
    background_music.volume = 0.4;
    document.getElementById('button_fullscreen').addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', updateFullscreenButton);
    setupAutoFullscreenForSmallDevices();
    setupMobileControls();
    updateMuteButton();
    updateMusicButton();
   //console.log('My character is', world.character);
}  

function openGameOverDialog(winOrLose) {
    let dialog = document.getElementById('dialog');
    background_music.pause();
    background_music.currentTime = 0;
    
    if (winOrLose === 'win') {
        if (!isMuted) {
            game_won_sound.currentTime = 0;
            game_won_sound.play();
        }
        const score = world?.character?.coins ?? 0;
        dialog.innerHTML = getDialogWonTemplate(score);
    } else {
        if (!isMuted) {
            game_over_sound.currentTime = 0;
            game_over_sound.play();
        }
        dialog.innerHTML = getDialogLostTemplate();
    }
    dialog.showModal(); 
}

function clearAllIntervals() {
    for (let i = 1; i < 9999; i++) {
        window.clearInterval(i);
    }
}

function updateMuteButton() {
    let button = document.getElementById('button_mute');
    let icon = button.querySelector('img');

    if (isMuted) {
        icon.src = "./assets/icons/sound_off.png";
        icon.alt = "Sound OFF Icon";
    } else {
        icon.src = "./assets/icons/sound.png";
        icon.alt = "Sound ON Icon";
    }
}

function updateMusicButton() {
    let button = document.getElementById('button_music');
    let icon = button.querySelector('img');

    if (isMusicMuted) {
        icon.src = "./assets/icons/music_off.png";
        icon.alt = "Music OFF Icon";
    } else {
        icon.src = "./assets/icons/music.png";
        icon.alt = "Music ON Icon";
    }
}

function saveAudioSettings() {
    localStorage.setItem('isMuted', isMuted.toString());
    localStorage.setItem('isMusicMuted', isMusicMuted.toString());
}

function toggleMute(){
    isMuted = !isMuted;
    if (isMuted) {
        stopChickenSounds();
    }
    updateMuteButton();
    saveAudioSettings();
}

function stopChickenSounds() {
    if (!world?.level?.enemies) {
        return;
    }

    world.level.enemies.forEach(enemy => {
        if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
            enemy.stopChickenSound();
        }
    });
}

function toggleMusic(){
    isMusicMuted = !isMusicMuted;

    if (isMusicMuted) {
        background_music.pause();
    } else if (isGameLoaded) {
        playBackgroundMusic();
    }

    updateMusicButton();
    saveAudioSettings();
}

function toggleFullscreen() {
    autoFullscreenEnabled = false;
    if (document.fullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        } else {
            document.webkitExitFullscreen?.();
        }
        return;
    }

    requestGameFullscreen();
}

function updateFullscreenButton() {
    const icon = document.querySelector('#button_fullscreen img');
    const isFullscreen = !!document.fullscreenElement;

    if (icon) {
        icon.src = isFullscreen ? './assets/icons/close_fullscreen.png' : './assets/icons/fullscreen.png';
    }

    if (isFullscreen) {
        hasEnteredFullscreen = true;
    } else if (hasEnteredFullscreen) {
        autoFullscreenEnabled = false;
    }
}

function requestGameFullscreen() {
    const element = document.getElementById('game_fullscreen');
    if (!element || document.fullscreenElement) return;

    if (element.requestFullscreen) {
        element.requestFullscreen().catch(() => {});
    } else {
        element.webkitRequestFullscreen?.();
    }
}

function setupAutoFullscreenForSmallDevices() {
    const tryAutoFullscreen = () => {
        if (isMobileDevice() && !window.matchMedia('(orientation: landscape)').matches && document.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            } else {
                document.webkitExitFullscreen?.();
            }
            return;
        }

        if (!autoFullscreenEnabled || !matchesAutoFullscreenDevice()) return;
        requestGameFullscreen();
    };

    tryAutoFullscreen();
    window.addEventListener('pointerdown', tryAutoFullscreen, { once: true });
    window.addEventListener('touchstart', tryAutoFullscreen, { once: true });
    window.addEventListener('orientationchange', tryAutoFullscreen);
    window.addEventListener('resize', tryAutoFullscreen);
}

function matchesAutoFullscreenDevice() {
    const isSmallWidth = window.innerWidth < 750 || window.screen.width < 750;
    const isSmallMobileScreen = Math.min(window.screen.width, window.screen.height) <= 900;
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;

    if (isMobileDevice()) {
        return isLandscape && (isSmallWidth || isSmallMobileScreen);
    }

    return isSmallWidth;
}

function isMobileDevice() {
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

function setupMobileControls() {
    [
        ['button_right', 'RIGHT'],
        ['button_left', 'LEFT'],
        ['button_jump', 'UP'],
        ['button_throw', 'D']
    ].forEach(([buttonId, key]) => {
        const button = document.getElementById(buttonId);
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
    const isGameKey = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Space', 'KeyD'].includes(code)
        || ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', ' ', 'Spacebar', 'd', 'D'].includes(key)
        || [39, 37, 38, 40, 32, 68].includes(keyCode);

    if (isGameKey) {
        e.preventDefault();
    }
    if (!isGameLoaded) {
        return;
    }
    if (code === 'ArrowRight' || key === 'ArrowRight' || key === 'Right' || keyCode == 39) {
        keyboard.RIGHT = isPressed;
    }
    if (code === 'ArrowLeft' || key === 'ArrowLeft' || key === 'Left' || keyCode == 37) {
        keyboard.LEFT = isPressed;
    }
    if (code === 'ArrowUp' || key === 'ArrowUp' || key === 'Up' || keyCode == 38) {
        keyboard.UP = isPressed;
    }
    if (code === 'ArrowDown' || key === 'ArrowDown' || key === 'Down' || keyCode == 40) {
        keyboard.DOWN = isPressed;
    }
    if (code === 'Space' || key === ' ' || key === 'Spacebar' || keyCode == 32) {
        keyboard.SPACE = isPressed;
    }
    if (code === 'KeyD' || key === 'd' || key === 'D' || keyCode == 68) {
        keyboard.D = isPressed;
    }
}

window.addEventListener("keydown", (e) => {
    updateKeyboardState(e, true);
})

window.addEventListener("keyup", (e) => {
    updateKeyboardState(e, false);
})



// Zufälligen Text auswählen (Loading Spinner)
function setRandomLoadingText() {
    const textElement = document.getElementById('loading_info');
    if (textElement) {
        const randomIndex = Math.floor(Math.random() * storyInfos.length);
        textElement.innerText = storyInfos[randomIndex];
    }
}

// Ladebildschirm weich ausblenden
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading_screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
    isGameLoaded = true;
    playBackgroundMusic();
}

function playBackgroundMusic() {
    if (isGameLoaded && !isMusicMuted) {
        background_music.play().catch(() => {});
    }
}

