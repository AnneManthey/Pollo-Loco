const gameAudio = {
    gameOver: new Audio('assets/sounds/game/gameOver.ogg'),
    gameWon: new Audio('assets/sounds/game/gameWon.ogg'),
    backgroundMusic: new Audio('assets/sounds/game/backgroundMusic.ogg')
};

const characterAudio = {
    snore: new Audio('assets/sounds/character/characterSnoring.ogg'),
    walk: new Audio('assets/sounds/character/characterRun.ogg'),
    jump: new Audio('assets/sounds/character/characterJump.ogg'),
    hurt: new Audio('assets/sounds/character/characterDamage.ogg'),
    dead: new Audio('assets/sounds/character/characterDead.ogg'),
    coinCollect: new Audio('assets/sounds/coins/collectSound.ogg'),
    bottleCollect: new Audio('assets/sounds/coins/bottleCollectSound.ogg')
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
 * Returns one named character audio element from the central registry.
 * @param {'snore'|'walk'|'jump'|'hurt'|'dead'|'coinCollect'|'bottleCollect'} key Audio id.
 * @returns {HTMLAudioElement | undefined} Matching audio element.
 */
function getCharacterAudio(key) {
    return characterAudio[key];
}

/**
 * Applies default settings to character-related audio tracks.
 */
function setupCharacterAudio() {
    const snore = getCharacterAudio('snore');
    const walk = getCharacterAudio('walk');
    const jump = getCharacterAudio('jump');
    const hurt = getCharacterAudio('hurt');
    const dead = getCharacterAudio('dead');

    if (snore) {
        snore.loop = true;
        snore.volume = 0.18;
    }
    if (walk) {
        walk.loop = true;
        walk.volume = 0.22;
    }
    if (jump) {
        jump.volume = 0.25;
    }
    if (hurt) {
        hurt.volume = 0.28;
    }
    if (dead) {
        dead.volume = 0.28;
    }
}

/**
 * Plays one character sound effect when effects are enabled.
 * @param {'snore'|'walk'|'jump'|'hurt'|'dead'|'coinCollect'|'bottleCollect'} key Audio id.
 * @param {{restart?: boolean}} [options] Playback options.
 */
function playCharacterAudio(key, options = {}) {
    if (isMuted) {
        return;
    }
    const audio = getCharacterAudio(key);
    if (!audio) {
        return;
    }
    const { restart = true } = options;
    if (restart) {
        audio.currentTime = 0;
    }
    audio.play().catch(() => { });
}

/**
 * Stops one character sound and optionally rewinds it.
 * @param {'snore'|'walk'|'jump'|'hurt'|'dead'|'coinCollect'|'bottleCollect'} key Audio id.
 * @param {{reset?: boolean}} [options] Stop options.
 */
function stopCharacterAudio(key, options = {}) {
    const audio = getCharacterAudio(key);
    if (!audio) {
        return;
    }
    const { reset = true } = options;
    audio.pause();
    if (reset) {
        audio.currentTime = 0;
    }
}

/**
 * Stops all currently managed character sounds.
 */
function stopAllCharacterAudio() {
    Object.keys(characterAudio).forEach((key) => {
        stopCharacterAudio(key);
    });
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
        stopAllCharacterAudio();
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
