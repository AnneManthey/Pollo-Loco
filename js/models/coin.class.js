class Coin extends Collectables {

    width;
    height;

    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(x,y) {
        super(x, y, 'img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_COIN);
        
    }

    collect(character){
        character.score += 10;
    }
}