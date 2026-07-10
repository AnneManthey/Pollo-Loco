class Bottle extends Collectables {

    height = 80;
    width = 60;
    IMAGES_BOTTLES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /**
     * Creates a bottle collectable and initializes a random ground sprite.
     * @param {number} x Spawn x-position (currently overridden by random placement).
     * @param {number} y Spawn y-position (currently overridden by fixed ground level).
     */
    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES_BOTTLES);
        let randomIndex = Math.floor(Math.random() * this.IMAGES_BOTTLES.length);
        this.loadImage(this.IMAGES_BOTTLES[randomIndex]);
        this.x = 300 + Math.random() * 1900;
        this.y = 370;
    }

    /**
     * Increases the player's bottle ammo when this collectable is picked up.
     * @param {Character} character Player character collecting the bottle.
     */
    collect(character) {
        character.ammo += 1;
    }
}