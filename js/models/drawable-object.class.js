class DrawableObject {
    x = 120;
    y = 290;
    height = 150;
    width = 100;
    img;
    imageCache = [];
    currentImage = 0;

    /**
     * Loads one image into the main drawable image slot.
     * @param {string} path Path to the image asset.
     */
    loadImage(path) {
        this.img = new Image(); // entspricht: this.img = document.getElementById('image')
        this.img.src = path;
    }

    /**
     * Draws the current image to the canvas context.
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     */
    draw(ctx) {
        if (!this.img || !this.img.complete || this.img.naturalWidth === 0) {
            return;
        }
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws a debug frame for selected object types.
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken) {
            ctx.beginPath();
            ctx.lineWidth = '1';
            ctx.strokeStyle = 'transparent';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    /**
     * Preloads multiple images into the internal image cache.
     * @param {string[]} arr Asset paths to preload.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }


















}