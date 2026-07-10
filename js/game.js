let canvas;
let world;
let keyboard = {
    LEFT: false,
    RIGHT: false,
    UP: false,
    DOWN: false,
    SPACE: false,
    D: false
};
let isMuted = localStorage.getItem('isMuted') === 'true';
let isMusicMuted = localStorage.getItem('isMusicMuted') === 'true';
let isGameLoaded = false;
let autoFullscreenEnabled = true;
let hasEnteredFullscreen = false;
const mobileFullscreenClass = 'mobile-fullscreen';
let gameOverSound = new Audio('assets/sounds/game/gameOver.ogg');
let gameWonSound = new Audio('assets/sounds/game/gameWon.ogg');
let backgroundMusic = new Audio('assets/sounds/game/backgroundMusic.ogg');
const storyInfos = [
    "Pepe has traveled deep into the desert to retrieve the stolen salsa bottles...",
    "Press 'D' to throw a salsa bottle at the chickens!",
    "Tiny chicks die after 1 hit, but the boss can take a whopping 3 hits!!",
    "Land precisely on top of the chickens to automatically bounce back up.",
    "The chickens have teamed up to plunder Pepe's coin collection..."
];

window.addEventListener('load', () => {
    setTimeout(hideLoadingScreen, 1500);
});

/**
 * Initializes the game world, UI controls, and audio defaults.
 */
function init(){
    setRandomLoadingText();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard, openGameOverDialog);
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.4;
    document.getElementById('button_fullscreen').addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', updateFullscreenButton);
    setupAutoFullscreenForSmallDevices();
    setupMobileControls();
    updateMuteButton();
    updateMusicButton();
}  

/**
 * Opens the game-over dialog and plays the matching end sound.
 * @param {'win'|'lose'} winOrLose Result state used to render the dialog.
 */
function openGameOverDialog(winOrLose) {
    let dialog = document.getElementById('dialog');
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    
    if (winOrLose === 'win') {
        if (!isMuted) {
            gameWonSound.currentTime = 0;
            gameWonSound.play();
        }
        const score = world?.character?.coins ?? 0;
        dialog.innerHTML = getDialogWonTemplate(score);
    } else {
        if (!isMuted) {
            gameOverSound.currentTime = 0;
            gameOverSound.play();
        }
        dialog.innerHTML = getDialogLostTemplate();
    }
    dialog.showModal(); 
}

/**
 * Clears running interval timers in a broad numeric range.
 */
function clearAllIntervals() {
    for (let i = 1; i < 9999; i++) {
        window.clearInterval(i);
    }
}

/**
 * Sets a random story hint in the loading overlay.
 */
function setRandomLoadingText() {
    const textElement = document.getElementById('loading_info');
    if (textElement) {
        const randomIndex = Math.floor(Math.random() * storyInfos.length);
        textElement.innerText = storyInfos[randomIndex];
    }
}

/**
 * Hides the loading screen, unlocks input flow, and starts background music.
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading_screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
    isGameLoaded = true;
    playBackgroundMusic();
}

