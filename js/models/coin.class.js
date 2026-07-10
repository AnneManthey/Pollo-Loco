class Coin extends Collectables {

    width = 100;
    height = 100;
    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Creates a coin at a random position within configured spawn ranges.
     * @param {number} x Spawn x-position (currently randomized internally).
     * @param {number} y Spawn y-position (currently randomized internally).
     */
    constructor(x,y) {
        super().loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COIN);
        let minX = 300;
        let maxX = 2200;
        this.x = minX + Math.random() * (maxX - minX);
        let minY = 150; 
        let maxY = 350; 
        this.y = minY + Math.random() * (maxY - minY);
        this.animate();
    }

    /**
     * Starts looping coin animation frames.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 400);
    }
}