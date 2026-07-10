class Cloud extends MovableObject {
    y = 20;
    height = 250;
    width = 500;
    

    /**
     * Creates a cloud with random x-position and starts drifting animation.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = 0 + Math.random() * 500;
        this.animate();
    }

    /**
     * Moves the cloud continuously to the left.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    } 
}