class ChickenSmall extends MovableObject {

    y = 360;
    height = 80;
    width = 50;
    hp = 1;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    minX = 300;
    maxX = 2000;
    movingLeft = true;
    isJumpable = true;
    chickenDead = false;
    isHit = false;
    isRemoved = false;

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = this.minX + Math.random() * (this.maxX - this.minX); // Startposition zufällig zwischen minX und maxX
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.chickenDead){
                return;
            }
            if (this.movingLeft){
            this.moveLeft();
            if (this.x <= this.minX){
                this.movingLeft = false;
                this.otherDirection = true;
            }
            } else {
                this.moveRight();
                if (this.x >= this.maxX){
                    this.movingLeft = true;
                    this.otherDirection = false;
                }
            }
            
        }, 1000 / 60);

        let deathAnimationTriggered = false;
    setInterval(() => {
        if (this.chickenDead) {
            this.playAnimation(this.IMAGES_DEAD); 
            
            if (!deathAnimationTriggered) {
                deathAnimationTriggered = true;
                setTimeout(() => {
                    this.isRemoved = true; // Totes chicken wird markiert zum Löschen
                }, 2000);
            }
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }, 200);
    }

}