class Coins extends Collectables {

    width;
    height;

    IMAGES_COINS = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(x,y) {
        super(x, y, 'img/8_coin/coin_1.png');
        
    }

    collect(character){
        character.score += 10;
    }
}