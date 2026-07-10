class ChickenSmall extends MovableObject {

    y = 360;
    height = 80;
    width = 50;
    hp = 1;
    minX = 300;
    maxX = 2000;
    movingLeft = true;
    isJumpable = true;
    chickenDead = false;
    isHit = false;
    isRemoved = false;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    chicken_dead = new Audio('assets/sounds/chicken/chickenDead2.ogg');
    chicken_dead_sound_is_playing = false;
    deathRemovalScheduled = false;

    /**
     * Creates a small chicken enemy with random start position and speed.
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = this.minX + Math.random() * (this.maxX - this.minX);
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    /**
     * Starts movement and animation intervals for this enemy.
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Starts the movement update loop.
     */
    startMovementLoop() {
        setInterval(() => {
            if (this.chickenDead) {
                return;
            }
            this.updateMovementDirection();
        }, 1000 / 60);
    }

    /**
     * Applies horizontal movement and turn logic.
     */
    updateMovementDirection() {
        if (this.movingLeft) {
            this.moveLeft();
            this.turnAroundAtLeftBoundary();
            return;
        }
        this.moveRight();
        this.turnAroundAtRightBoundary();
    }

    /**
     * Starts the sprite animation and death-state loop.
     */
    startAnimationLoop() {
        setInterval(() => {
            if (!this.chickenDead) {
                this.playAnimation(this.IMAGES_WALKING);
                return;
            }
            this.handleDeadAnimation();
        }, 200);
    }

    /**
     * Handles dead animation, one-shot sound, and delayed removal.
     */
    handleDeadAnimation() {
        this.playDeathSoundOnce();
        this.playAnimation(this.IMAGES_DEAD);
        this.scheduleRemovalAfterDeath();
    }

    /**
     * Plays death sound once if effects are enabled.
     */
    playDeathSoundOnce() {
        if (this.chicken_dead_sound_is_playing) {
            return;
        }
        if (!isMuted) {
            this.chicken_dead.currentTime = 0;
            this.chicken_dead.play();
        }
        this.chicken_dead_sound_is_playing = true;
    }

    /**
     * Schedules enemy removal once after death animation starts.
     */
    scheduleRemovalAfterDeath() {
        if (this.deathRemovalScheduled) {
            return;
        }
        this.deathRemovalScheduled = true;
        setTimeout(() => {
            this.isRemoved = true;
        }, 2000);
    }

    /**
     * Turns around when left movement boundary is reached.
     */
    turnAroundAtLeftBoundary() {
        if (this.x > this.minX) {
            return;
        }
        this.movingLeft = false;
        this.otherDirection = true;
    }

    /**
     * Turns around when right movement boundary is reached.
     */
    turnAroundAtRightBoundary() {
        if (this.x < this.maxX) {
            return;
        }
        this.movingLeft = true;
        this.otherDirection = false;
    }

    /**
     * Stops the chicken death sound immediately.
     */
    stopChickenSound() {
        this.chicken_dead.pause();
        this.chicken_dead.currentTime = 0;
    }

}
