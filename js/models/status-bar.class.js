class StatusBar extends DrawableObject {
    IMAGES = [];
    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
       
        this.width = 200;
        this.height = 60;

    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() { //wird als index vom array verwendet, um das entsprechende Bild zu laden
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