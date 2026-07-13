class Character extends MovableObject {
    y = 100;
    GROUND_Y = 100;
    height = 350;
    width = 130;
    speed = 8;
    hp = 100;
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

    /**
     * Creates the playable character and initializes movement/audio loops.
     */
    constructor() {
        super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadCharacterAnimations();
        this.configureCharacterAudio();
        this.lastAction = Date.now();
        this.applyGravity();
        this.animate();
    }

    /**
     * Preloads all animation image sets for the character.
     */
    loadCharacterAnimations() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SLEEP);
    }

    /**
     * Applies loop and volume settings for character sounds.
     */
    configureCharacterAudio() {
        this.walking_sound.loop = true;
        this.snoring_sound.loop = true;
        this.snoring_sound.volume = 0.18;
        this.walking_sound.volume = 0.22;
        this.jump_sound.volume = 0.25;
        this.hurt_sound.volume = 0.28;
        this.dead_sound.volume = 0.28;
    }

    /**
     * Starts movement, state animation, and idle/sleep behavior loops.
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
        this.startIdleLoop();
    }

    /**
     * Starts per-frame movement and movement-audio updates.
     */
    startMovementLoop() {
        setInterval(() => {
            const isMoving = this.handleHorizontalMovement();
            this.handleMovementActivity();
            this.handleJumpInput();
            this.updateWalkingSound(isMoving);
        }, 1000 / 60);
    }

    /**
     * Starts the animation state update loop.
     */
    startAnimationLoop() {
        setInterval(() => {
            if (this.handleDeadAnimation()) {
                return;
            }
            if (this.handleHurtAnimation()) {
                return;
            }
            this.playNormalMovementAnimation();
        }, 80);
    }

    /**
     * Starts idle/sleep animation and snoring behavior loop.
     */
    startIdleLoop() {
        setInterval(() => {
            if (!this.isIdleStateActive()) {
                this.stopSnoringSound();
                return;
            }
            this.playIdleOrSleepAnimation();
        }, 350);
    }

    /**
     * Handles input activity timestamp updates and snoring stop.
     */
    handleMovementActivity() {
        if (!this.isAnyMovementKeyPressed()) {
            return;
        }

        this.lastAction = Date.now();
        this.stopSnoringSound();
    }

    /**
     * Applies left/right movement and returns whether character moved.
     * @returns {boolean} True when horizontal movement happened.
     */
    handleHorizontalMovement() {
        let isMoving = false;
        isMoving = this.moveCharacterRight() || isMoving;
        isMoving = this.moveCharacterLeft() || isMoving;
        return isMoving;
    }

    /**
     * Moves character right when allowed.
     * @returns {boolean} True when moved right.
     */
    moveCharacterRight() {
        if (!this.world.keyboard.RIGHT || this.x >= this.world.level.level_end_x) {
            return false;
        }
        this.moveRight();
        this.otherDirection = false;
        return true;
    }

    /**
     * Moves character left when allowed.
     * @returns {boolean} True when moved left.
     */
    moveCharacterLeft() {
        if (!this.world.keyboard.LEFT || this.x <= 0) {
            return false;
        }
        this.moveLeft();
        this.otherDirection = true;
        return true;
    }

    /**
     * Handles jump input, cooldown flag reset, and jump sound.
     */
    handleJumpInput() {
        if (!this.isDead() && !this.isAboveGround()) {
            this.jump_sound_is_playing = false;
        }
        if (!this.canStartJump()) {
            return;
        }
        this.lastAction = Date.now();
        this.jump();
        this.playJumpSound();
        this.jump_sound_is_playing = true;
    }

    /**
     * Checks whether jump should start for current input/state.
     * @returns {boolean} True when jump can be triggered.
     */
    canStartJump() {
        const wantsToJump = this.world.keyboard.SPACE || this.world.keyboard.UP;
        return wantsToJump && !this.isAboveGround() && !this.jump_sound_is_playing && !this.isDead();
    }

    /**
     * Plays jump sound if effects are enabled.
     */
    playJumpSound() {
        if (isMuted) {
            return;
        }
        this.jump_sound.currentTime = 0;
        this.jump_sound.play();
    }

    /**
     * Updates walking sound based on movement and character state.
     * @param {boolean} isMoving Whether character moved this frame.
     */
    updateWalkingSound(isMoving) {
        if (this.shouldPlayWalkingSound(isMoving)) {
            this.startWalkingSound();
            return;
        }
        this.stopWalkingSound();
    }

    /**
     * Evaluates if walking audio should currently play.
     * @param {boolean} isMoving Whether character moved this frame.
     * @returns {boolean} True when walking sound should play.
     */
    shouldPlayWalkingSound(isMoving) {
        return isMoving && !isMuted && !this.isDead() && !this.isHurt() && !this.isAboveGround();
    }

    /**
     * Starts walking sound if not already playing.
     */
    startWalkingSound() {
        if (this.walking_sound_is_playing) {
            return;
        }
        this.walking_sound.currentTime = 0;
        this.walking_sound.play();
        this.walking_sound_is_playing = true;
    }

    /**
     * Stops walking sound and resets playback state.
     */
    stopWalkingSound() {
        this.walking_sound.pause();
        this.walking_sound.currentTime = 0;
        this.walking_sound_is_playing = false;
    }

    /**
     * Handles dead animation and one-shot death sound.
     * @returns {boolean} True when dead state handled.
     */
    handleDeadAnimation() {
        if (!this.isDead()) {
            return false;
        }
        if (!this.dead_sound_is_playing && !isMuted) {
            this.dead_sound.currentTime = 0;
            this.dead_sound.play();
            this.dead_sound_is_playing = true;
        }
        this.playAnimation(this.IMAGES_DEAD);
        return true;
    }

    /**
     * Handles hurt animation and one-shot hurt sound.
     * @returns {boolean} True when hurt state handled.
     */
    handleHurtAnimation() {
        if (!this.isHurt()) {
            return false;
        }
        if (!this.hurt_sound_is_playing && !isMuted) {
            this.hurt_sound.currentTime = 0;
            this.hurt_sound.play();
            this.hurt_sound_is_playing = true;
        }
        this.playAnimation(this.IMAGES_HURT);
        return true;
    }

    /**
     * Plays normal movement animation while not dead/hurt.
     */
    playNormalMovementAnimation() {
        this.hurt_sound_is_playing = false;
        if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
            return;
        }
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Checks whether idle/sleep state logic should run.
     * @returns {boolean} True when character is idle on ground.
     */
    isIdleStateActive() {
        return !this.isDead() && !this.isHurt() && !this.isAboveGround() && !this.isMovingHorizontally();
    }

    /**
     * Checks whether left/right movement keys are currently active.
     * @returns {boolean} True when moving horizontally.
     */
    isMovingHorizontally() {
        return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    }

    /**
     * Checks whether any movement-relevant key is currently active.
     * @returns {boolean} True when movement input is active.
     */
    isAnyMovementKeyPressed() {
        return this.world.keyboard.RIGHT
            || this.world.keyboard.LEFT
            || this.world.keyboard.SPACE
            || this.world.keyboard.UP
            || this.world.keyboard.D;
    }

    /**
     * Plays either sleep animation with snoring or normal idle animation.
     */
    playIdleOrSleepAnimation() {
        const idleSeconds = (Date.now() - this.lastAction) / 1000;
        if (idleSeconds > 10) {
            this.playAnimation(this.IMAGES_SLEEP);
            this.playSnoringSound();
            return;
        }
        this.stopSnoringSound();
        this.playAnimation(this.IMAGES_IDLE);
    }

    /**
     * Plays snoring sound when idle sleep state is active.
     */
    playSnoringSound() {
        if (!isMuted && !this.snoring_sound_is_playing) {
            this.snoring_sound.currentTime = 0;
            this.snoring_sound.play();
            this.snoring_sound_is_playing = true;
        } else if (isMuted) {
            this.stopSnoringSound();
        }
    }

    /**
     * Stops and resets snoring sound playback.
     */
    stopSnoringSound() {
        if (this.snoring_sound_is_playing) {
            this.snoring_sound.pause();
            this.snoring_sound.currentTime = 0;
            this.snoring_sound_is_playing = false;
        }
    }

    /**
     * Applies jump impulse to the character.
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Checks whether character is currently above ground level.
     * @returns {boolean} True when character is airborne.
     */
    isAboveGround() {
        return this.y < this.GROUND_Y;
    }

    /**
     * Adds coin value to the score and plays collect sound.
     */
    collectCoin() {
        this.lastAction = Date.now();
        this.coins += 10;
        if (!isMuted) {
            this.coin_collect_sound.currentTime = 0;
            this.coin_collect_sound.play();
        }
    }

    /**
     * Adds one bottle ammo, clamps max ammo, and plays collect sound.
     */
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

    /**
     * Applies one character hit. Character dies after 5 hits.
     */
    hit() {
        this.hp -= 20;
        if (this.hp < 0) {
            this.hp = 0;
        } else {
            this.lastHit = Date.now();
        }
    }
}
