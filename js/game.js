let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = localStorage.getItem('isMuted') === 'true';
let isMusicMuted = localStorage.getItem('isMusicMuted') === 'true';
let game_over_sound = new Audio('assets/sounds/game/gameOver.ogg');
let game_won_sound = new Audio('assets/sounds/game/gameWon.ogg');
let background_music = new Audio('assets/sounds/game/backgroundMusic.ogg');

function init(){
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard, openGameOverDialog);
    background_music.loop = true;
    background_music.volume = 0.4;
    updateMuteButton();
    updateMusicButton();
    if (!isMuted && !isMusicMuted) {
        background_music.play().catch(() => {});
    }
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
    updateMuteButton();
    saveAudioSettings();
}

function toggleMusic(){
    isMusicMuted = !isMusicMuted;

    if (isMusicMuted) {
        background_music.pause();
    } else if (!isMuted) {
        background_music.play().catch(() => {});
    }

    updateMusicButton();
    saveAudioSettings();
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

