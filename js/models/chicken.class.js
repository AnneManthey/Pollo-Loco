class Chicken extends MovableObject {

    y = 360;
    height = 80;
    width = 50;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ]
    minX = 300;
    maxX = 1000;
    movingLeft = true;

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = this.minX + Math.random() * (this.maxX - this.minX); // Startposition zufällig zwischen minX und maxX
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        setInterval(() => {
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

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200)
    }

}