class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 1000;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            // Wenn das Objekt eine getroffene Flasche ist und Gravitation gestoppt wurde,
            // dann nicht weiter die Gravitation anwenden.
            if (this instanceof ThrowableObject && this.stoppedGravity) {
                return;
            }

            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 150;
        }
    }

    isColliding(mo, padding = 0) {
        const left = this.x + padding;
        const right = this.x + this.width - padding;
        const top = this.y + padding;
        const bottom = this.y + this.height - padding;

        return right > mo.x + padding &&
            left < mo.x + mo.width - padding &&
            bottom > mo.y + padding &&
            top < mo.y + mo.height - padding;
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // difference in ms
        timepassed = timepassed / 1000; // difference in sek
        return timepassed < 1;
    }

    isDead() {
        return this.energy == 0;
    }


    playAnimation(images) {
        let i = this.currentImage % images.length; // modulo (%): i = 0, 1, 2, 3, 4, 5, 6, 0, 1, ...
        let path = images[i];
        const nextImage = this.imageCache[path];
        if (nextImage && nextImage.complete && nextImage.naturalWidth > 0) {
            this.img = nextImage;
        }
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    };


    jump() {
        this.speedY = 30;
    }
}