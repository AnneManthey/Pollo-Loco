class ThrowableObject extends MovableObject {

    isHit = false;
    groundImpactY = 450;
    throwDirection = 1;
    throwSpeedX = 8;
    bottle_break_sound_is_playing = false;

    IMAGES_THROWING = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];
    
    /**
     * Creates a throwable bottle and starts throw plus animation behavior.
     * @param {number} x Initial x-position.
     * @param {number} y Initial y-position.
     * @param {number} [throwDirection=1] Horizontal throw direction (`1` right, `-1` left).
     * @param {number} [groundImpactY=450] Ground line (bottom y) where splash should trigger.
     */
    constructor(x, y, throwDirection = 1, groundImpactY = 450) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_THROWING);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.throwDirection = throwDirection < 0 ? -1 : 1;
        this.groundImpactY = groundImpactY;
        this.otherDirection = this.throwDirection < 0;
        this.height = 80;
        this.width = 60;
        this.throw();
        this.animate();
    }

    /**
     * Animates bottle rotation or splash frames depending on hit state.
     */
    animate() {
        setInterval(() => {
            if (!this.isHit) {
                this.playAnimation(this.IMAGES_THROWING);
            } else {
                if (!this.bottle_break_sound_is_playing && !isMuted) {
                    playEnemyAudio('bottleBreak', { allowOverlap: true });
                    this.bottle_break_sound_is_playing = true;
                }
                this.playAnimation(this.IMAGES_SPLASH);
            }
        }, 1000 / 60);
    }

    /**
     * Applies throw impulse and forward movement until impact.
     */
    throw() {
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            if (!this.isHit) {
                this.x += this.throwSpeedX * this.throwDirection;
                this.handleGroundImpact();
            }
        }, 25);
    }

    /**
     * Triggers splash state when bottle touches the ground.
     */
    handleGroundImpact() {
        if (this.y + this.height < this.groundImpactY) {
            return;
        }
        this.triggerSplashState();
    }

    /**
     * Switches bottle from flight to splash animation state.
     */
    triggerSplashState() {
        this.isHit = true;
        this.bottle_break_sound_is_playing = false;
        this.splashStart = Date.now();
        this.splashDuration = 200;
        this.speedY = 0;
        this.stoppedGravity = true;
        this.acceleration = 0;
    }
}