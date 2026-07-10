class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    hp = 1000;
    lastHit = 0;

    /**
     * Applies gravity by updating vertical position and speed over time.
     */
    applyGravity() {
        setInterval(() => {
            if (this instanceof ThrowableObject && this.stoppedGravity) {
                return;
            }
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks whether object is currently above its ground reference.
     * @returns {boolean} True when object is above ground.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 150;
        }
    }

    /**
     * Checks axis-aligned collision with another movable object.
     * @param {MovableObject} mo Other object to test.
     * @param {number} [padding=0] Collision padding to shrink hitboxes.
     * @returns {boolean} True when objects overlap.
     */
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

    /**
     * Applies damage and updates hit timestamp.
     */
    hit() {
        this.hp -= 5;
        if (this.hp < 0) {
            this.hp = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Returns whether object is still in temporary hurt state.
     * @returns {boolean} True while hurt cooldown is active.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // difference in ms
        timepassed = timepassed / 1000; // difference in sek
        return timepassed < 1;
    }

    /**
     * Returns whether object health is depleted.
     * @returns {boolean} True when hp reached zero.
     */
    isDead() {
        return this.hp == 0;
    }

    /**
     * Advances animation frame using the supplied image list.
     * @param {string[]} images Animation frame paths.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length; // modulo (%)
        let path = images[i];
        const nextImage = this.imageCache[path];
        if (nextImage && nextImage.complete && nextImage.naturalWidth > 0) {
            this.img = nextImage;
        }
        this.currentImage++;
    }

    /**
     * Moves object to the right by its speed value.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves object to the left by its speed value.
     */
    moveLeft() {
        this.x -= this.speed;
    };

    /**
     * Applies an upward jump impulse.
     */
    jump() {
        this.speedY = 30;
    }
}