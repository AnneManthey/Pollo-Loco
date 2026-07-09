class Character extends MovableObject {

    y = 100;
    GROUND_Y = 100;
    height = 350;
    width = 130;
    speed = 8;
    coins = 0;
    ammo = 0;
    world;

    snoring_sound = new Audio('assets/sounds/character/characterSnoring.ogg');
    snoring_sound_is_playing = false;

    walking_sound = new Audio('assets/sounds/character/characterRun.ogg');
    walking_sound_is_playing = false;
    jump_sound = new Audio('assets/sounds/character/characterJump.ogg');
    jump_sound_is_playing = false;
    hurt_sound = new Audio('assets/sounds/character/characterDamage.ogg');
    hurt_sound_is_playing = false;
    dead_sound = new Audio('assets/sounds/character/characterDead.ogg');
    dead_sound_is_playing = false;
    coin_collect_sound = new Audio('assets/sounds/coins/collectSound.ogg');
    bottle_collect_sound = new Audio('assets/sounds/coins/bottleCollectSound.ogg');

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    IMAGES_SLEEP = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ]





    constructor() {
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SLEEP);
        this.applyGravity();
        this.lastAction = Date.now();
        this.walking_sound.loop = true;
        this.snoring_sound.loop = true;
        this.snoring_sound.volume = 0.18;
        this.walking_sound.volume = 0.22;
        this.jump_sound.volume = 0.25;
        this.hurt_sound.volume = 0.28;
        this.dead_sound.volume = 0.28;
        this.animate();
    }

    animate() {

        setInterval(() => {
            let isMoving = false;

            // prüft ob eine Bewegung stattfindet und setzt ggf den timer zurück
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.SPACE || this.world.keyboard.UP || this.world.keyboard.D) {
                this.lastAction = Date.now();
                this.stopSnoringSound();
            }
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                isMoving = true;
            }

            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
                isMoving = true;
            }

            if (!this.isDead() && !this.isAboveGround()) {
                this.jump_sound_is_playing = false;
            }

            const wantsToJump = this.world.keyboard.SPACE || this.world.keyboard.UP;

            if (wantsToJump && !this.isAboveGround() && !this.jump_sound_is_playing && !this.isDead()) {
                this.lastAction = Date.now();
                this.jump();
                if (!isMuted) {
                    this.jump_sound.currentTime = 0;
                    this.jump_sound.play();
                }
                this.jump_sound_is_playing = true;
            }

            if (isMoving && !isMuted && !this.isDead() && !this.isHurt() && !this.isAboveGround()) {
                if (!this.walking_sound_is_playing) {
                    this.walking_sound.currentTime = 0;
                    this.walking_sound.play();
                    this.walking_sound_is_playing = true;
                }
            } else {
                this.walking_sound.pause();
                this.walking_sound.currentTime = 0;
                this.walking_sound_is_playing = false;
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {

            if (this.isDead()) {
                if (!this.dead_sound_is_playing && !isMuted) {
                    this.dead_sound.currentTime = 0;
                    this.dead_sound.play();
                    this.dead_sound_is_playing = true;
                }
                this.playAnimation(this.IMAGES_DEAD);
            }
            else if (this.isHurt()) {
                if (!this.hurt_sound_is_playing && !isMuted) {
                    this.hurt_sound.currentTime = 0;
                    this.hurt_sound.play();
                    this.hurt_sound_is_playing = true;
                }
                this.playAnimation(this.IMAGES_HURT);
            }
            else {
                this.hurt_sound_is_playing = false;
                if (this.isAboveGround()) {
                    this.playAnimation(this.IMAGES_JUMPING);
                }
                else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }

        }, 80);

        setInterval(() => {
            if (!this.isDead() && !this.isHurt() && !this.isAboveGround() && !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
                let timePassed = (Date.now() - this.lastAction) / 1000;     //berechnet sekunden nach letzter aktion
                if (timePassed > 10) {
                    this.playAnimation(this.IMAGES_SLEEP);
                    this.playSnoringSound();
                } else {
                    this.stopSnoringSound();
                    this.playAnimation(this.IMAGES_IDLE);
                }
            } else {
                this.stopSnoringSound();
            }
        }, 350);
    }

    playSnoringSound() {
        if (!isMuted && !this.snoring_sound_is_playing) {
            this.snoring_sound.currentTime = 0;
            this.snoring_sound.play();
            this.snoring_sound_is_playing = true;
        } else if (isMuted) {
            this.stopSnoringSound();
        }
    }

    stopSnoringSound() {
        if (this.snoring_sound_is_playing) {
            this.snoring_sound.pause();
            this.snoring_sound.currentTime = 0;
            this.snoring_sound_is_playing = false;
        }
    }

    jump() {
        this.speedY = 30;
    }

    isAboveGround() {
        return this.y < this.GROUND_Y;
    }

    collectCoin() {
        this.lastAction = Date.now();
        this.coins += 10;
        if (!isMuted) {
            this.coin_collect_sound.currentTime = 0;
            this.coin_collect_sound.play();
        }
    }

    collectBottle() {
        this.lastAction = Date.now();
        this.ammo += 1;
        if (this.ammo > 10) {
            this.ammo = 10;
        }
        if (!isMuted) {
            this.bottle_collect_sound.currentTime = 0;
            this.bottle_collect_sound.play();
        }
    }
}
