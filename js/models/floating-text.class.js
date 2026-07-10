class FloatingText extends MovableObject {

    /**
     * Creates an animated floating combat text element.
     * @param {string} text Displayed text value.
     * @param {number} x Horizontal draw position.
     * @param {number} y Vertical draw position.
     */
    constructor(text, x, y) {
        super();
        this.text = text;
        this.x = x;
        this.y = y;
        this.opacity = 1.0; // Start-Sichtbarkeit (voll sichtbar)
        this.speedY = 1.5;  // Wie schnell der Text nach oben schwebt
        this.isRemoved = false;

        this.animate();
    }

    /**
     * Moves text upwards and fades it out over time.
     */
    animate() {
        let textInterval = setInterval(() => {
            this.y -= 1;        // Text schwebt langsam nach oben
            this.opacity -= 0.05;

            if (this.opacity <= 0) {
                this.isRemoved = true;
                clearInterval(textInterval);
            }
        }, 50);
    }

    /**
     * Draws the floating text with current opacity.
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     */
    draw(ctx) {
        ctx.save(); 
        ctx.globalAlpha = this.opacity;
        ctx.font = "bold 24px Arial"; 
        ctx.fillStyle = "red";        
        ctx.textAlign = "center";
        
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore(); 
    }
}