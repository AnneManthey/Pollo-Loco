class ScoreBar extends StatusBar {
     IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png',
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
        ctx.fillStyle = 'orange';
        ctx.textAlign = 'center';
        ctx.fillText(`${this.scoreValue}`, this.x + 100, this.y + 40);
        ctx.textAlign = 'left';
    }
}