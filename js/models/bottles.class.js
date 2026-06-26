class Bottles extends Collectables {

    width;
    height;

    IMAGES_BOTTLES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor() {
        super(x, y, 'img/6_salsa_bottle/salsa_bottle.png');
    }

    collect(character){
        character.bottlesAmmo += 1;
    }
}