class ThrowableObject extends MovableObject {

    isHit = false;
    bottle_break_sound = new Audio('assets/sounds/bottles/bottleBreak.ogg');
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
     */
    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_THROWING);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
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
                    this.bottle_break_sound.currentTime = 0;
                    this.bottle_break_sound.play();
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
                this.x += 8;
            }
        }, 25);
    }
}