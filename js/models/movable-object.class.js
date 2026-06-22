class MovableObject {
    x = 120;
    y = 290; 
    img;
    height = 150;
    width = 100;
    imageCache = [];
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;

    applyGravity(){
        setInterval(() => {
            if (this.isAboveGround() ){
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround(){
        return this.y < 180;
    }

    loadImage(path){
        this.img = new Image(); // entspricht: this.img = document.getElementById('image')
        this.img.src = path;
    }

    loadImages(arr){
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    playAnimation(images){
        let i = this.currentImage % this.IMAGES_WALKING.length; // modulo (%): i = 0, 1, 2, 3, 4, 5, 6, 0, 1, ...
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage++;
    }

    moveRight() {
        console.log('Moving Right');
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }
}