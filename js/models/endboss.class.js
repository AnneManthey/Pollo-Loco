class Endboss extends MovableObject {

    height = 350;
    width = 200;
    y = 100;
    maxHp = 5;
    hp = 5;
    attackSpeed = 15;
    retreatSpeed = 5;
    attackProgress = 0;
    attackDirection = 'forward';

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];
    isHurt = false;
    isDead = false;
    isAttacking = false;
    bossActive = false;
    bossState = 'idle';
    deathStartedAt = null;
    approach_sound = new Audio('assets/sounds/endboss/endbossApproach.ogg');
    approach_sound_is_playing = false;

    /**
     * Creates the endboss with preloaded animations and default state.
     */
    constructor(){
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 2300;
        this.speed = 0.25;
        this.animate();
    }

    /**
     * Starts movement, animation, and AI state intervals.
     */
    animate(){
        this.startMovementLoop();
        this.startSpriteLoop();
        this.startAiStateLoop();
    }

    /**
     * Starts movement behavior loop for attack/walk states.
     */
    startMovementLoop() {
        setInterval(() => {
            if (this.isAttacking) {
                this.attackMovement();
            } else if (this.bossState === 'walk') {
                this.walkTowardsCharacter();
            } else {
                this.attackProgress = 0;
                this.attackDirection = 'forward';
            }
        }, 1000 / 60);
    }

    /**
     * Starts sprite animation loop based on current boss state.
     */
    startSpriteLoop() {
        setInterval(() => {
            this.playAnimation(this.getCurrentAnimationFrames());
        }, 200);
    }

    /**
     * Resolves the active animation frame set for current boss state.
     * @returns {string[]} Animation frame paths.
     */
    getCurrentAnimationFrames() {
        if (this.isDead) return this.IMAGES_DEAD;
        if (this.isHurt) return this.IMAGES_HURT;
        if (this.bossState === 'attack') return this.IMAGES_ATTACK;
        if (this.bossState === 'walk') return this.IMAGES_WALKING;
        return this.IMAGES_ALERT;
    }

    /**
     * Starts AI state evaluation loop based on player distance.
     */
    startAiStateLoop() {
        setInterval(() => {
            if (this.isDead || !this.hasWorldCharacter()) {
                return;
            }
            const distance = Math.abs(this.x - this.world.character.x);
            this.updateBossStateByDistance(distance);
        }, 100);
    }

    /**
     * Checks if world and character references are available.
     * @returns {boolean} True when world character is available.
     */
    hasWorldCharacter() {
        return !!(this.world && this.world.character);
    }

    /**
     * Updates boss state transitions based on character distance.
     * @param {number} distance Absolute distance to character.
     */
    updateBossStateByDistance(distance) {
        if (distance <= 200) {
            this.setAttackState();
            return;
        }
        if (distance <= 300) {
            this.setAlertState();
            return;
        }
        if (distance <= 500) {
            this.setWalkState();
            return;
        }
        this.setIdleState();
    }

    /**
     * Switches boss to attack state.
     */
    setAttackState() {
        this.bossState = 'attack';
        this.bossActive = true;
        this.isAttacking = true;
    }

    /**
     * Switches boss to alert state and plays approach sound once.
     */
    setAlertState() {
        this.bossState = 'alert';
        this.bossActive = true;
        this.isAttacking = false;
        this.playApproachSoundOnce();
    }

    /**
     * Switches boss to walk state.
     */
    setWalkState() {
        this.bossState = 'walk';
        this.bossActive = true;
        this.isAttacking = false;
        this.approach_sound_is_playing = false;
    }

    /**
     * Switches boss to idle state.
     */
    setIdleState() {
        this.bossState = 'idle';
        this.bossActive = false;
        this.isAttacking = false;
        this.approach_sound_is_playing = false;
    }

    /**
     * Plays approach sound once while in alert state.
     */
    playApproachSoundOnce() {
        if (this.approach_sound_is_playing || isMuted) {
            return;
        }
        this.approach_sound.currentTime = 0;
        this.approach_sound.play();
        this.approach_sound_is_playing = true;
    }

    /**
     * Moves the boss toward the character in walk state.
     */
    walkTowardsCharacter() {
        if (this.world && this.world.character) {
            const distance = this.world.character.x - this.x;
            if (distance < 0) {
                this.x -= this.speed;
            } else {
                this.x += this.speed;
            }
        }
    }

    /**
     * Executes forward/backward attack movement cycle.
     */
    attackMovement() {
        if (this.attackDirection === 'forward') {
            this.x -= this.attackSpeed;
            this.attackProgress += this.attackSpeed;

            if (this.attackProgress >= 250) {
                this.attackDirection = 'backward';
            }
        } else if (this.attackDirection === 'backward') {
            this.x += this.retreatSpeed;
            this.attackProgress -= this.retreatSpeed;

            if (this.attackProgress <= 0) {
                this.attackDirection = 'forward';
            }
        }
    }

    /**
     * Applies one hit to the boss and updates state transitions.
     */
    hit() {
        if (this.isDead || this.isHurt) return;
        this.hp -= 1;
        if (this.hp <= 0) {
            this.isDead = true;
            this.deathStartedAt = Date.now();
            this.isAttacking = false;
            this.bossState = 'dead';
        } else {
            this.isHurt = true;
            setTimeout(() => {
                this.isHurt = false;
            }, 1000);
        }
    }

}