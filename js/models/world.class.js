class World {

    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar = new HealthBar();
    scoreBar = new ScoreBar();
    ammoBar = new AmmoBar();
    //bossBar = new BossBar();
    throwableObjects = [];
    floatingTexts = [];


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        if (this.level && this.level.enemies) {
            this.level.enemies.forEach(enemy => {
                enemy.world = this;
            });
        }
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkTrowObjects();
            this.checkBottleCollisions();
            this.checkCollectableCollisions();
            this.clearDeadEnemies();
            this.clearFloatingTexts();
            this.clearThrowableObjects();

        }, 200);
    }

    clearDeadEnemies() {
        if (this.level && this.level.enemies) {
            this.level.enemies = this.level.enemies.filter(enemy => !enemy.isRemoved);
        }
    }

    clearFloatingTexts() {
        this.floatingTexts = this.floatingTexts.filter(text => !text.isRemoved);
    }

    checkTrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    }

    checkBottleCollisions() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {

                    if (enemy instanceof Endboss) {
                        enemy.hit(); // Ruft die neue hit()-Methode des Bosses auf
                        // Flasche zerstören / aus dem Array entfernen
                        this.throwableObjects.splice(this.throwableObjects.indexOf(bottle), 1);
                    }
                }
                // Prüfen, ob die Flasche den Gegner berührt UND der Gegner noch lebt
                else if (bottle.isColliding(enemy) && !enemy.chickenDead) {
                    enemy.hp -= 1;

                    // Floating Text
                    let textX = enemy.x + (enemy.width / 2);
                    let textY = enemy.y - 10;
                    this.floatingTexts.push(new FloatingText('-1', textX, textY));

                    // Markiere Flasche als getroffen, starte Splash-Timer und stoppe Bewegung/Gravitation
                    bottle.isHit = true;
                    bottle.splashStart = new Date().getTime();
                    bottle.splashDuration = 200; // ms, kurz sichtbar
                    bottle.speedY = 0;
                    bottle.stoppedGravity = true;
                    bottle.acceleration = 0;

                    if (enemy.hp <= 0) {
                        enemy.chickenDead = true;
                    }
                }
            });
        });
    }

    clearThrowableObjects() {
        // Bereinigt Flaschen:
        // - Ungetroffene Flaschen werden entfernt, wenn sie unter die Karte fallen (y >= 360)
        // - Getroffene Flaschen (isHit) bleiben kurz für die Splash-Animation sichtbar
        const now = new Date().getTime();
        this.throwableObjects = this.throwableObjects.filter(bottle => {
            if (bottle.isHit) {
                const elapsed = now - (bottle.splashStart || 0);
                return elapsed < (bottle.splashDuration || 200);
            }
            return bottle.y < 300;
        });
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                if (enemy instanceof Endboss) {
                    if (enemy.isAttacking && !enemy.isDead) {
                        this.character.hit(); // Charakter verliert Energie
                        this.healthBar.setPercentage(this.character.energy);
                    }
                }

                // Sprungangriff / collidiert von oben
                else if (enemy.isJumpable && this.character.speedY < 0 && this.character.y + this.character.height < enemy.y + enemy.height) {
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
                this.healthBar.setPercentage(this.character.energy);
            }
        });
    }

    checkCollectableCollisions() {
        this.level.collectables.forEach((item, index) => {
            if (this.character.isColliding(item)) {

                if (item instanceof Coin) {
                    this.character.collectCoin(); // Erhöht z.B. ein internes Attribut im Charakter
                    this.scoreBar.setPercentage(this.character.coins); // Aktualisiert die Score-Bar

                    this.level.collectables.splice(index, 1);
                }

                else if (item instanceof Bottle) {
                    this.character.collectBottle(); // Erhöht z.B. die Munition im Charakter
                    this.ammoBar.setPercentage(this.character.ammo); // Aktualisiert die Ammo-Bar

                    this.level.collectables.splice(index, 1);
                }
            }
        });
    }






    // Draw wird immer wieder aufgerufen (soviele FPS, wie die Grafikkarte hergibt)
    draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.collectables);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.healthBar);
        this.addToMap(this.scoreBar);
        this.addToMap(this.ammoBar);

        // Boss Healthbar
        let boss = this.level.enemies.find(e => e instanceof Endboss);
        if (boss && boss.isAttacking) {
            this.addToMap(this.bossBar);
        }

        // -------- Spaceholder for fixed objects ------------

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.clouds);
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