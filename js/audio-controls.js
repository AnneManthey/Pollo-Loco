const gameAudio = {
    gameOver: new Audio('assets/sounds/game/gameOver.ogg'),
    gameWon: new Audio('assets/sounds/game/gameWon.ogg'),
    backgroundMusic: new Audio('assets/sounds/game/backgroundMusic.ogg')
};

/**
 * Returns one named audio element from the central game audio registry.
 * @param {'gameOver'|'gameWon'|'backgroundMusic'} key Audio id.
 * @returns {HTMLAudioElement | undefined} Matching audio element.
 */
function getGameAudio(key) {
    return gameAudio[key];
}

/**
 * Applies default settings to game-level audio tracks.
 */
function setupGameAudio() {
    const bgMusic = getGameAudio('backgroundMusic');
    if (!bgMusic) {
        return;
    }
    bgMusic.loop = true;
    bgMusic.volume = 0.4;
}

/**
 * Plays one short game sound effect when effects are enabled.
 * @param {'gameOver'|'gameWon'} key Effect audio id.
 */
function playGameSfx(key) {
    if (isMuted) {
        return;
    }
    const sound = getGameAudio(key);
    if (!sound) {
        return;
    }
    sound.currentTime = 0;
    sound.play().catch(() => { });
}

/**
 * Stops and rewinds background music.
 */
function resetBackgroundMusic() {
    const bgMusic = getGameAudio('backgroundMusic');
    if (!bgMusic) {
        return;
    }
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

/**
 * Updates the sound-effects button icon based on mute state.
 */
function updateMuteButton() {
    let button = document.getElementById('button_mute');
    let icon = button.querySelector('img');

    if (isMuted) {
        icon.src = './assets/icons/sound_off.png';
        icon.alt = 'Sound OFF Icon';
    } else {
        icon.src = './assets/icons/sound.png';
        icon.alt = 'Sound ON Icon';
    }
}

/**
 * Updates the background-music button icon based on music mute state.
 */
function updateMusicButton() {
    let button = document.getElementById('button_music');
    let icon = button.querySelector('img');

    if (isMusicMuted) {
        icon.src = './assets/icons/music_off.png';
        icon.alt = 'Music OFF Icon';
    } else {
        icon.src = './assets/icons/music.png';
        icon.alt = 'Music ON Icon';
    }
}

/**
 * Persists audio settings in local storage.
 */
function saveAudioSettings() {
    localStorage.setItem('isMuted', isMuted.toString());
    localStorage.setItem('isMusicMuted', isMusicMuted.toString());
}

/**
 * Toggles sound effects and updates UI plus saved preferences.
 */
function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) {
        stopChickenSounds();
    }
    updateMuteButton();
    saveAudioSettings();
}

/**
 * Stops active chicken sounds from all current enemies.
 */
function stopChickenSounds() {
    if (!world?.level?.enemies) {
        return;
    }

    world.level.enemies.forEach((enemy) => {
        if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
            enemy.stopChickenSound();
        }
    });
}

/**
 * Toggles background music and updates UI plus saved preferences.
 */
function toggleMusic() {
    isMusicMuted = !isMusicMuted;
    const bgMusic = getGameAudio('backgroundMusic');

    if (isMusicMuted && bgMusic) {
        bgMusic.pause();
    } else if (isGameLoaded) {
        playBackgroundMusic();
    }

    updateMusicButton();
    saveAudioSettings();
}

/**
 * Starts background music when game and music settings allow it.
 */
function playBackgroundMusic() {
    const bgMusic = getGameAudio('backgroundMusic');
    if (isGameLoaded && !isMusicMuted && bgMusic) {
        bgMusic.play().catch(() => { });
    }
}
