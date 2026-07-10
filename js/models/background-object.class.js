class BackgroundObject extends MovableObject{

    width = 720;
    height = 480;
    
    /**
     * Creates one background tile at a fixed ground-aligned height.
     * @param {string} imagePath Path to the background sprite.
     * @param {number} x Horizontal world position.
     * @param {number} y Vertical world position (currently normalized to ground alignment).
     */
    constructor(imagePath, x, y){
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}