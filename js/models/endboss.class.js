class Endboss extends MovableObject {

    height = 350;
    width = 200;
    y = 100;
    maxHp = 5;
    hp = 5;
    attackSpeed = 15;
    retreatSpeed = 5;
    chaseSpeed = 1.2;
    aggroRange = 850;
    attackRange = 240;
    attackCooldown = 900;
    attackLungeDistance = 220;
    lastAttackAt = 0;
    alertStartedAt = 0;
    alertDuration = 1600;
    alertCompleted = false;
    attackVector = -1;
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
        this.alertDuration = this.IMAGES_ALERT.length * 200;
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
            const distanceX = this.getCharacterDistanceX();
            this.updateFacingByDistance(distanceX);
            this.updateBossStateByDistance(Math.abs(distanceX));
        }, 100);
    }

    /**
     * Returns signed horizontal distance from boss center to character center.
     * @returns {number} Negative when character is left, positive when right.
     */
    getCharacterDistanceX() {
        const characterCenter = this.world.character.x + (this.world.character.width / 2);
        const bossCenter = this.x + (this.width / 2);
        return characterCenter - bossCenter;
    }

    /**
     * Updates sprite direction so boss faces the character.
     * @param {number} distanceX Signed horizontal distance to character.
     */
    updateFacingByDistance(distanceX) {
        this.otherDirection = distanceX > 0;
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
        if (this.isAttacking) {
            return;
        }

        if (this.bossState === 'alert') {
            if (!this.isAlertFinished()) {
                return;
            }
            this.finishAlertState();
        }

        if (distance <= this.attackRange && !this.isThrowOnCooldown()) {
            this.setAttackState();
            return;
        }
        if (distance <= this.attackRange + 120) {
            if (!this.alertCompleted) {
                this.setAlertState();
                return;
            }
            this.setWalkState();
            return;
        }
        if (distance <= this.aggroRange) {
            this.setWalkState();
            return;
        }
        this.setIdleState();
    }

    /**
     * Returns whether the alert animation has completed one full cycle.
     * @returns {boolean} True when alert phase can transition to walk.
     */
    isAlertFinished() {
        return Date.now() - this.alertStartedAt >= this.alertDuration;
    }

    /**
     * Ends alert phase and enables aggressive chase behavior.
     */
    finishAlertState() {
        this.alertCompleted = true;
        this.setWalkState();
    }

    /**
     * Checks whether a new attack is still on cooldown.
     * @returns {boolean} True when boss cannot start next attack yet.
     */
    isThrowOnCooldown() {
        return Date.now() - this.lastAttackAt < this.attackCooldown;
    }

    /**
     * Switches boss to attack state.
     */
    setAttackState() {
        this.bossState = 'attack';
        this.bossActive = true;
        this.isAttacking = true;
        this.attackDirection = 'forward';
        this.attackProgress = 0;
        this.attackVector = this.getCharacterDistanceX() >= 0 ? 1 : -1;
        this.otherDirection = this.attackVector > 0;
    }

    /**
     * Switches boss to alert state and plays approach sound once.
     */
    setAlertState() {
        if (this.bossState === 'alert') {
            return;
        }
        this.bossState = 'alert';
        this.bossActive = true;
        this.isAttacking = false;
        this.alertStartedAt = Date.now();
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
        this.alertStartedAt = 0;
        this.alertCompleted = false;
        this.approach_sound_is_playing = false;
    }

    /**
     * Plays approach sound once while in alert state.
     */
    playApproachSoundOnce() {
        if (this.approach_sound_is_playing || isMuted) {
            return;
        }
        playEnemyAudio('endbossApproach');
        this.approach_sound_is_playing = true;
    }

    /**
     * Moves the boss toward the character in walk state.
     */
    walkTowardsCharacter() {
        if (this.world && this.world.character) {
            const distanceX = this.getCharacterDistanceX();
            if (Math.abs(distanceX) <= this.attackRange * 0.75) {
                return;
            }
            const direction = distanceX >= 0 ? 1 : -1;
            this.otherDirection = direction > 0;
            this.x += direction * this.chaseSpeed;
        }
    }

    /**
     * Executes forward/backward attack movement cycle.
     */
    attackMovement() {
        if (this.attackDirection === 'forward') {
            this.x += this.attackVector * this.attackSpeed;
            this.attackProgress += this.attackSpeed;

            if (this.attackProgress >= this.attackLungeDistance) {
                this.attackDirection = 'backward';
            }
        } else if (this.attackDirection === 'backward') {
            this.x -= this.attackVector * this.retreatSpeed;
            this.attackProgress -= this.retreatSpeed;

            if (this.attackProgress <= 0) {
                this.finishAttack();
            }
        }
    }

    /**
     * Finalizes one attack cycle and enables cooldown.
     */
    finishAttack() {
        this.isAttacking = false;
        this.bossState = 'walk';
        this.attackDirection = 'forward';
        this.attackProgress = 0;
        this.lastAttackAt = Date.now();
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