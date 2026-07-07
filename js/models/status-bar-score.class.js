class ScoreBar extends StatusBar {
     IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png',
     ]

    constructor(){
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 100;
        this.setPercentage(0);
    }

    setPercentage(percentage) {
        this.scoreValue = percentage;
        const clampedPercentage = Math.min(percentage, 100);
        super.setPercentage(clampedPercentage);
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.font = '20px zabars';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(`Your Score: ${this.scoreValue}`, this.x + 100, this.y + 46);
        ctx.textAlign = 'left';
    }
}