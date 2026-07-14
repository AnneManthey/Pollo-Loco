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

const enemyAudio = {
    chickenDead: new Audio('assets/sounds/chicken/chickenDead.ogg'),
    chickenDeadSmall: new Audio('assets/sounds/chicken/chickenDead2.ogg'),
    endbossApproach: new Audio('assets/sounds/endboss/endbossApproach.ogg'),
    bottleBreak: new Audio('assets/sounds/bottles/bottleBreak.ogg'),
    wrongBottle: new Audio('assets/sounds/bottles/wrong.ogg')
};

const activeEnemyAudioInstances = new Set();

const audioRegistries = {
    game: gameAudio,
    character: characterAudio,
    enemy: enemyAudio
};

/**
 * Returns one named audio element from a registry.
 * @param {'game'|'character'|'enemy'} registryName Registry id.
 * @param {string} key Audio id.
 * @returns {HTMLAudioElement | undefined} Matching audio element.
 */
function getAudio(registryName, key) {
    return audioRegistries[registryName]?.[key];
}

/**
 * Returns one named audio element from the central game audio registry.
 * @param {'gameOver'|'gameWon'|'backgroundMusic'} key Audio id.
 * @returns {HTMLAudioElement | undefined} Matching audio element.
 */
function getGameAudio(key) {
    return getAudio('game', key);
}

/**
 * Returns one named character audio element from the central registry.
 * @param {'snore'|'walk'|'jump'|'hurt'|'dead'|'coinCollect'|'bottleCollect'} key Audio id.
 * @returns {HTMLAudioElement | undefined} Matching audio element.
 */
function getCharacterAudio(key) {
    return getAudio('character', key);
}

/**
 * Returns one named enemy/world SFX audio element from the central registry.
 * @param {'chickenDead'|'chickenDeadSmall'|'endbossApproach'|'bottleBreak'|'wrongBottle'} key Audio id.
 * @returns {HTMLAudioElement | undefined} Matching audio element.
 */
function getEnemyAudio(key) {
    return getAudio('enemy', key);
}

/**
 * Plays one sound effect from a registry when effects are enabled.
 * @param {'game'|'character'|'enemy'} registryName Registry id.
 * @param {string} key Audio id.
 * @param {{restart?: boolean, allowOverlap?: boolean}} [options] Playback options.
 */
function playSfx(registryName, key, options = {}) {
    if (isMuted) {
        return;
    }
    const baseAudio = getAudio(registryName, key);
    if (!baseAudio) {
        return;
    }

    const { restart = true, allowOverlap = false } = options;
    const audio = allowOverlap ? baseAudio.cloneNode() : baseAudio;

    if (restart) {
        audio.currentTime = 0;
    }

    if (registryName === 'enemy') {
        activeEnemyAudioInstances.add(audio);
        audio.addEventListener('ended', () => {
            activeEnemyAudioInstances.delete(audio);
        }, { once: true });
    }

    audio.play().catch(() => {
        activeEnemyAudioInstances.delete(audio);
    });
}

/**
 * Stops one sound effect from a registry.
 * @param {'game'|'character'|'enemy'} registryName Registry id.
 * @param {string} key Audio id.
 * @param {{reset?: boolean}} [options] Stop options.
 */
function stopSfx(registryName, key, options = {}) {
    const audio = getAudio(registryName, key);
    if (!audio) {
        return;
    }
    const { reset = true } = options;
    audio.pause();
    if (reset) {
        audio.currentTime = 0;
    }
    if (registryName === 'enemy') {
        activeEnemyAudioInstances.delete(audio);
    }
}

/**
 * Stops all sounds in one registry.
 * @param {'game'|'character'|'enemy'} registryName Registry id.
 */
function stopAllSfx(registryName) {
    if (registryName === 'enemy') {
        activeEnemyAudioInstances.forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
        activeEnemyAudioInstances.clear();
    }

    Object.keys(audioRegistries[registryName] || {}).forEach((key) => {
        stopSfx(registryName, key);
    });
}

/**
 * Plays one enemy/world sound effect when effects are enabled.
 * @param {'chickenDead'|'chickenDeadSmall'|'endbossApproach'|'bottleBreak'|'wrongBottle'} key Audio id.
 * @param {{restart?: boolean, allowOverlap?: boolean}} [options] Playback options.
 */
function playEnemyAudio(key, options = {}) {
    playSfx('enemy', key, options);
}

/**
 * Stops one tracked enemy/world sound effect.
 * @param {'chickenDead'|'chickenDeadSmall'|'endbossApproach'|'bottleBreak'|'wrongBottle'} key Audio id.
 */
function stopEnemyAudio(key) {
    stopSfx('enemy', key);
}

/**
 * Stops all active enemy/world sound effects.
 */
function stopAllEnemyAudio() {
    stopAllSfx('enemy');
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
    playSfx('character', key, options);
}

/**
 * Stops one character sound and optionally rewinds it.
 * @param {'snore'|'walk'|'jump'|'hurt'|'dead'|'coinCollect'|'bottleCollect'} key Audio id.
 * @param {{reset?: boolean}} [options] Stop options.
 */
function stopCharacterAudio(key, options = {}) {
    stopSfx('character', key, options);
}

/**
 * Stops all currently managed character sounds.
 */
function stopAllCharacterAudio() {
    stopAllSfx('character');
}

/**
 * Plays character snoring sound when allowed and marks state flag.
 * @param {Character} character Character instance.
 */
function playCharacterSnoringIfAllowed(character) {
    if (!isMuted && !character.snoring_sound_is_playing) {
        playCharacterAudio('snore');
        character.snoring_sound_is_playing = true;
        return;
    }
    if (isMuted) {
        stopCharacterSnoring(character);
    }
}

/**
 * Stops character snoring sound and resets state flag.
 * @param {Character} character Character instance.
 */
function stopCharacterSnoring(character) {
    if (!character.snoring_sound_is_playing) {
        return;
    }
    stopCharacterAudio('snore');
    character.snoring_sound_is_playing = false;
}

/**
 * Plays character jump sound.
 */
function playCharacterJumpSound() {
    playCharacterAudio('jump');
}

/**
 * Starts looping character walking sound if not active yet.
 * @param {Character} character Character instance.
 */
function startCharacterWalkingSound(character) {
    if (character.walking_sound_is_playing) {
        return;
    }
    playCharacterAudio('walk', { restart: false });
    character.walking_sound_is_playing = true;
}

/**
 * Stops character walking sound and resets state flag.
 * @param {Character} character Character instance.
 */
function stopCharacterWalkingSound(character) {
    stopCharacterAudio('walk');
    character.walking_sound_is_playing = false;
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
    playSfx('game', key);
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
    stopAllEnemyAudio();
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
