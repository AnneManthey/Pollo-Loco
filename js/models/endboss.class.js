class Endboss extends MovableObject {

    height = 400;
    width = 250;
    y = 60;
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

    animate(){

        setInterval(() => {
            if (this.isAttacking) {
                this.attackMovement();
            } else {
                // Platzhalter, walking/stehen/abwarten
                this.attackProgress = 0; // Reset, wenn er nicht mehr angreift
                this.attackDirection = 'forward';
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAttacking) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else {
            this.playAnimation(this.IMAGES_ALERT);
            }
        }, 200);

        setInterval(() => {
            if (!this.isDead && this.world && this.world.character) {
                // Berechnet den Abstand auf der X-Achse zwischen Boss und Charakter
                let distance = Math.abs(this.x - this.world.character.x);

                if (distance < 200) {
                    this.isAttacking = true;
                } else {
                    this.isAttacking = false;
                }
            }
        }, 100);
    }

    attackMovement() {
        if (this.attackDirection === 'forward') {
            // Angriff nach vorn
            this.x -= this.attackSpeed;
            this.attackProgress += this.attackSpeed;

            // Zurück nach 250px
            if (this.attackProgress >= 250) {
                this.attackDirection = 'backward';
            }
        } else if (this.attackDirection === 'backward') {
            // Langsam zurück
            this.x += this.retreatSpeed;
            this.attackProgress -= this.retreatSpeed;

            // Wieder vor, wenn er am Ausgangspunkt ankommt
            if (this.attackProgress <= 0) {
                this.attackDirection = 'forward';
            }
        }
    }

    hit() {
        if (this.isDead || this.isHurt) return; // Verhindert Mehrfachtreffer im selben Moment

        this.hp -= 1;
        if (this.hp <= 0) {
            this.isDead = true;
        } else {
            this.isHurt = true;
            // Nach 1 Sekunde ist der Boss nicht mehr im "Hurt"-Status
            setTimeout(() => {
                this.isHurt = false;
            }, 1000);
        }
    }

}