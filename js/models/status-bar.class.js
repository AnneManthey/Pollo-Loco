class StatusBar extends DrawableObject {
    IMAGES = [];
    percentage = 100;

    /**
     * Creates a status bar base object with default dimensions.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
       
        this.width = 180;
        this.height = 50;

    }

    /**
     * Sets current percentage and updates displayed sprite.
     * @param {number} percentage New bar value in percent.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves sprite index for current percentage value.
     * @returns {number} Sprite index in IMAGES array.
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }

}