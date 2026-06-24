class World {

    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];
    floatingTexts = [];


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        //this.floatingTexts = [];
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkTrowObjects();
            this.clearDeadEnemies();
            this.clearFloatingTexts();

        }, 200);
    }

    clearDeadEnemies() {
        if (this.level && this.level.enemies) {
            this.level.enemies = this.level.enemies.filter(enemy => !enemy.isRemoved);
        }
    }

    clearFloatingTexts(){
        this.floatingTexts = this.floatingTexts.filter(text => !text.isRemoved);
    }

    checkTrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {

                // Sprungangriff / collidiert von oben
                if (enemy.isJumpable && this.character.speedY < 0 && this.character.y + this.character.height < enemy.y + enemy.height) {
                    if (enemy.isHit || enemy.chickenDead) return; // kein weiteres hochfedern, wenn Gegner bereits getroffen wurde
                    enemy.isHit = true;
                    enemy.hp -= 1;

                    let textX = enemy.x + (enemy.width / 2);
                    let textY = enemy.y - 10;
                    this.floatingTexts.push(new FloatingText('-1', textX, textY));

                    this.character.jump(); // Hochfedern nach Sprungangriff
                    this.character.speedY = 15;

                    if (enemy.hp <= 0) {
                        enemy.chickenDead = true;
                    } else {
                        setTimeout(() => {
                            enemy.isHit = false;
                        }, 200);
                    }

                    return;
                }
                // Kein Schaden, wenn das Chicken bereits tot ist oder der Character gerade nach oben springt 
                if (enemy.chickenDead || this.character.speedY > 0) {
                    return;
                }
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
    }





    // Draw wird immer wieder aufgerufen (soviele FPS, wie die Grafikkarte hergibt)
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.camera_x, 0);
        // -------- Spaceholder for fixed objects ------------
        this.addToMap(this.statusBar);
        this.ctx.translate(this.camera_x, 0);



        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);

        this.floatingTexts.forEach((text) => {
            text.draw(this.ctx);
        });

        this.addObjectsToMap(this.throwableObjects);


        this.ctx.translate(-this.camera_x, 0);



        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);

        })
    }

    addToMap(mo) {          // mo Abk./ unsere Variable für movable Object, ctx same für context
        if (mo.otherDirection) {     // turn image, wenn otherDirection true ist
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

}