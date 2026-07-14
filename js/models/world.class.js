class World {

    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    gameEnded = false;
    gameOverCallback;
    healthBar = new HealthBar();
    scoreBar = new ScoreBar();
    ammoBar = new AmmoBar();
    bossBar = new BossBar();
    throwableObjects = [];
    floatingTexts = [];
    wrong_bottle_sound = new Audio('assets/sounds/bottles/wrong.ogg');
    lastThrowTime = 0;
    throwCooldown = 180;
    throwKeyLocked = false;
    lastNoAmmoFeedbackTime = 0;
    noAmmoFeedbackCooldown = 500;
    collisionSystem;
    renderer;

    /**
     * Creates world context, wires dependencies, and starts loops.
     * @param {HTMLCanvasElement} canvas Canvas element for rendering.
     * @param {Object} keyboard Shared keyboard state object.
     * @param {(result: 'win'|'lose') => void} gameOverCallback Callback for end-state dialog.
     */
    constructor(canvas, keyboard, gameOverCallback) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.gameOverCallback = gameOverCallback;
        this.setWorld();
        this.collisionSystem = new WorldCollisionSystem(this);
        this.renderer = new WorldRenderer(this);
        this.draw();
        this.run();
    }

    /**
     * Injects world reference into character and enemies.
     */
    setWorld() {
        this.character.world = this;
        if (this.level && this.level.enemies) {
            this.level.enemies.forEach(enemy => {
                enemy.world = this;
            });
        }
    }

    /**
     * Starts the central gameplay update interval.
     */
    run() {
        setInterval(() => {
            this.updateCameraPosition();
            this.checkGameOver();
            this.checkTrowObjects();
            this.checkCollisions();
            this.checkBottleCollisions();
            this.checkCollectableCollisions();
            this.clearDeadEnemies();
            this.clearFloatingTexts();
            this.clearThrowableObjects();
        }, 1000 / 60);
    }

    /**
     * Keeps camera aligned with the character x-position.
     */
    updateCameraPosition() {
        this.camera_x = -this.character.x + 100;
    }

    /**
     * Evaluates win/lose conditions and ends game when reached.
     */
    checkGameOver() {
        if (this.gameEnded) {
            return;
        }
        if (this.isCharacterDefeated()) {
            this.endGame('lose');
            return;
        }
        if (this.isBossReadyForWin()) {
            this.endGame('win');
        }
    }

    /**
     * Checks if character has no remaining hp.
     * @returns {boolean} True when character is defeated.
     */
    isCharacterDefeated() {
        return this.character.hp <= 0;
    }

    /**
     * Returns the endboss instance from current enemy list.
     * @returns {Endboss|undefined} Endboss instance if present.
     */
    getBoss() {
        return this.level.enemies.find(enemy => enemy instanceof Endboss);
    }

    /**
     * Checks whether boss death animation delay for win has elapsed.
     * @returns {boolean} True when win state should trigger.
     */
    isBossReadyForWin() {
        const boss = this.getBoss();
        if (!boss || !boss.isDead) {
            return false;
        }
        const deathAnimationDuration = (boss.IMAGES_DEAD?.length || 3) * 200;
        const extraWinDelay = 1000;
        const deathStartedAt = boss.deathStartedAt || Date.now();
        return Date.now() - deathStartedAt >= deathAnimationDuration + extraWinDelay;
    }

    /**
     * Finalizes game state and triggers game-over callback.
     * @param {'win'|'lose'} result End result state.
     */
    endGame(result) {
        this.gameEnded = true;
        clearAllIntervals(); 

        if (this.gameOverCallback) {
            this.gameOverCallback(result);
        }
    }

    /**
     * Removes enemies marked as removable.
     */
    clearDeadEnemies() {
        if (this.level && this.level.enemies) {
            this.level.enemies = this.level.enemies.filter(enemy => !enemy.isRemoved);
        }
    }

    /**
     * Removes floating texts that finished their animation.
     */
    clearFloatingTexts() {
        this.floatingTexts = this.floatingTexts.filter(text => !text.isRemoved);
    }

    /**
     * Handles throw input, cooldown, ammo usage, and error sound.
     */
    checkTrowObjects() {
        const now = Date.now();
        if (!this.keyboard.D) {
            this.throwKeyLocked = false;
            this.handleNoAmmoFeedback(now);
            return;
        }
        if (this.shouldThrowBottle(now)) {
            this.throwBottle(now);
            return;
        }
        this.handleNoAmmoFeedback(now);
    }

    /**
     * Checks if a throw should happen in current frame.
     * @param {number} now Current timestamp in ms.
     * @returns {boolean} True when bottle throw should execute.
     */
    shouldThrowBottle(now) {
        return this.keyboard.D && !this.throwKeyLocked && this.character.ammo >= 1 && !this.isThrowOnCooldown(now);
    }

    /**
     * Checks whether throw action is currently on cooldown.
     * @param {number} now Current timestamp in ms.
     * @returns {boolean} True when throw is blocked by cooldown.
     */
    isThrowOnCooldown(now) {
        return now - this.lastThrowTime < this.throwCooldown;
    }

    /**
     * Creates and registers one throwable bottle.
     * @param {number} now Current timestamp in ms.
     */
    throwBottle(now) {
        this.lastThrowTime = now;
        this.throwKeyLocked = true;
        const throwDirection = this.character.otherDirection ? -1 : 1;
        const spawnOffsetX = throwDirection > 0 ? 100 : 10;
        const groundImpactY = this.character.GROUND_Y + this.character.height;
        const bottle = new ThrowableObject(
            this.character.x + spawnOffsetX,
            this.character.y + 100,
            throwDirection,
            groundImpactY
        );
        this.throwableObjects.push(bottle);
        this.character.ammo = Math.max(0, this.character.ammo - 1);
        this.ammoBar.setPercentage(this.character.ammo * 10);
    }

    /**
     * Plays error sound when throw is pressed without ammo.
     */
    playWrongBottleSound() {
        if (!this.keyboard.D || this.character.ammo > 0 || isMuted) {
            return;
        }
        this.wrong_bottle_sound.currentTime = 0;
        this.wrong_bottle_sound.play();
    }

    /**
     * Handles sound and floating-text feedback when no bottle ammo is available.
     * @param {number} now Current timestamp in ms.
     */
    handleNoAmmoFeedback(now) {
        if (!this.shouldShowNoAmmoFeedback(now)) {
            return;
        }
        this.lastNoAmmoFeedbackTime = now;
        this.playWrongBottleSound();
        this.showNoAmmoFloatingText();
    }

    /**
     * Checks whether no-ammo feedback should be shown in this frame.
     * @param {number} now Current timestamp in ms.
     * @returns {boolean} True when no-ammo feedback should be displayed.
     */
    shouldShowNoAmmoFeedback(now) {
        if (!this.keyboard.D || this.character.ammo > 0) {
            return false;
        }
        return now - this.lastNoAmmoFeedbackTime >= this.noAmmoFeedbackCooldown;
    }

    /**
     * Displays a short floating text in the center of the visible canvas.
     */
    showNoAmmoFloatingText() {
        const textX = (this.canvas.width / 2) - this.camera_x;
        const textY = this.canvas.height / 2;
        this.floatingTexts.push(new FloatingText('No bottles!', textX, textY));
    }

    /**
     * Resolves collisions between bottles and enemies.
     */
    checkBottleCollisions() {
        this.collisionSystem.checkBottleCollisions();
    }

    /**
     * Removes finished splash bottles and out-of-bounds projectiles.
     */
    clearThrowableObjects() {
        this.collisionSystem.clearThrowableObjects();
    }

    /**
     * Resolves collisions between character and enemies.
     */
    checkCollisions() {
        this.collisionSystem.checkCollisions();
    }

    /**
     * Resolves collisions between character and collectables.
     */
    checkCollectableCollisions() {
        this.collisionSystem.checkCollectableCollisions();
    }

    /**
     * Renders world layers and schedules the next animation frame.
     */
    draw() {
        this.renderer.draw();
    }

}