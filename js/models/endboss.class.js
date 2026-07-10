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

        setInterval(() => {
            if (this.isDead) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.bossState === 'attack') {
                this.playAnimation(this.IMAGES_ATTACK);
            } else if (this.bossState === 'alert') {
                this.playAnimation(this.IMAGES_ALERT);
            } else if (this.bossState === 'walk') {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_ALERT);
            }
        }, 200);

        setInterval(() => {
            if (!this.isDead && this.world && this.world.character) {
                let distance = Math.abs(this.x - this.world.character.x);

                // Ab 200px: Boss geht in den Angriffsstatus über.
                if (distance <= 200) {
                    this.bossState = 'attack';
                    this.bossActive = true;
                    this.isAttacking = true;
                // Ab 300px: Boss wechselt in den Alert-Status.
                } else if (distance <= 300) {
                    this.bossState = 'alert';
                    this.bossActive = true;
                    this.isAttacking = false;

                    if (!this.approach_sound_is_playing && !isMuted) {
                        this.approach_sound.currentTime = 0;
                        this.approach_sound.play();
                        this.approach_sound_is_playing = true;
                    }
                // Ab 500px: Boss beginnt langsam auf den Character zuzugehen.
                } else if (distance <= 500) {
                    this.bossState = 'walk';
                    this.bossActive = true;
                    this.isAttacking = false;
                    this.approach_sound_is_playing = false;
                } else {
                    this.bossState = 'idle';
                    this.bossActive = false;
                    this.isAttacking = false;
                    this.approach_sound_is_playing = false;
                }
            }
        }, 100);
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
        if (this.isDead || this.isHurt) return; // Verhindert Mehrfachtreffer im selben Moment
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