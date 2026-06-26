class Collectables extends MovableObject {



    constructor (x,y, imagePath){
        super();
        this.x = x;
        this.y = y;
        this.loadIMages(imagePath)
    }


    playCollectSound(){

    }
}