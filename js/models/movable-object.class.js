class MovableObject {
    x = 120;
    y = 250; 
    img;
    height = 150;
    width = 100;

    loadImage(path){
        this.img = new Image(); // entspricht: this.img = document.getElementById('image')
        this.img.src = path;
    }

    moveRight() {
        console.log('Moving Right');
    }

    moveLeft(){}
}