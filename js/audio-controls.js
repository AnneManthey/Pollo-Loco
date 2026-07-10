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

function saveAudioSettings() {
    localStorage.setItem('isMuted', isMuted.toString());
    localStorage.setItem('isMusicMuted', isMusicMuted.toString());
}

function toggleMute() {
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

    world.level.enemies.forEach((enemy) => {
        if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
            enemy.stopChickenSound();
        }
    });
}

function toggleMusic() {
    isMusicMuted = !isMusicMuted;

    if (isMusicMuted) {
        backgroundMusic.pause();
    } else if (isGameLoaded) {
        playBackgroundMusic();
    }

    updateMusicButton();
    saveAudioSettings();
}

function playBackgroundMusic() {
    if (isGameLoaded && !isMusicMuted) {
        backgroundMusic.play().catch(() => {});
    }
}
