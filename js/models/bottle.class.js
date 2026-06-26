class Bottle extends Collectables {

    height = 80;
    width = 60;
    

    IMAGES_BOTTLES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES_BOTTLES);
        let randomIndex = Math.floor(Math.random() * this.IMAGES_BOTTLES.length);
        this.loadImage(this.IMAGES_BOTTLES[randomIndex]);
        this.x = 300 + Math.random() * 1900;
        this.y = 370;
    }

    collect(character) {
        character.bottlesAmmo += 1;
    }
}