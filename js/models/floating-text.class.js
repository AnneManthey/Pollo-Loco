class FloatingText extends MovableObject {

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

    animate() {
        let textInterval = setInterval(() => {
            this.y -= 1;        // Text schwebt langsam nach oben
            this.opacity -= 0.05; // Text verblasst

            if (this.opacity <= 0) {
                this.isRemoved = true; // Markierung für die World-Klasse
                clearInterval(textInterval); // Stoppt die Bewegung dieses Textes
            }
        }, 50);
    
    }

    draw(ctx) {
        ctx.save(); 
        ctx.globalAlpha = this.opacity; // Transparenz
        ctx.font = "bold 24px Arial"; // Schriftgröße und -art
        ctx.fillStyle = "red";        // Farbe des Schadens
        ctx.textAlign = "center";
        
        // Text auf Canvas zeichnen
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore(); 
    }
}