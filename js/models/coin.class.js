class Coin extends Collectables {

    width = 100;
    height = 100;

    IMAGES_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(x,y) {
        super();
        let i = Math.floor(Math.random() * this.IMAGES_COIN.length);
        let selectedImage = this.IMAGES_COIN[i];
        this.loadImage(selectedImage);

        // Verteilung X-Achse
        let minX = 300;
        let maxX = 2200;
        this.x = minX + Math.random() * (maxX - minX);

        // Variation Höhe
        let minY = 150; 
        let maxY = 350; 
        this.y = minY + Math.random() * (maxY - minY);

    
    }

    collect(character){
        character.score += 10;
    }
}