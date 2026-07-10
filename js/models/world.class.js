class World {

    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    gameEnded = false;
    gameOverCallback;
    healthBar = new HealthBar();
    scoreBar = new ScoreBar();
    ammoBar = new AmmoBar();
    bossBar = new BossBar();
    throwableObjects = [];
    floatingTexts = [];
    wrong_bottle_sound = new Audio('assets/sounds/bottles/wrong.ogg');
    lastThrowTime = 0;
    throwCooldown = 180;


    /**
     * Creates world context, wires dependencies, and starts loops.
     * @param {HTMLCanvasElement} canvas Canvas element for rendering.
     * @param {Object} keyboard Shared keyboard state object.
     * @param {(result: 'win'|'lose') => void} gameOverCallback Callback for end-state dialog.
     */
    constructor(canvas, keyboard, gameOverCallback) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.gameOverCallback = gameOverCallback;
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Injects world reference into character and enemies.
     */
    setWorld() {
        this.character.world = this;
        if (this.level && this.level.enemies) {
            this.level.enemies.forEach(enemy => {
                enemy.world = this;
            });
        }
    }

    /**
     * Starts the central gameplay update interval.
     */
    run() {
        setInterval(() => {
            this.updateCameraPosition();
            this.checkCollisions();
            this.checkGameOver();
            this.checkTrowObjects();
            this.checkBottleCollisions();
            this.checkCollectableCollisions();
            this.clearDeadEnemies();
            this.clearFloatingTexts();
            this.clearThrowableObjects();
        }, 1000 / 60);
    }

    /**
     * Keeps camera aligned with the character x-position.
     */
    updateCameraPosition() {
        this.camera_x = -this.character.x + 100;
    }

    /**
     * Evaluates win/lose conditions and ends game when reached.
     */
    checkGameOver() {
        if (this.gameEnded) return;

        if (this.character.energy <= 0) {
            this.endGame('lose');
        }
        let boss = this.level.enemies.find(e => e instanceof Endboss);
        if (boss && boss.isDead) {
            const deathAnimationDuration = (boss.IMAGES_DEAD?.length || 3) * 200;
            const extraWinDelay = 1000;
            const deathStartedAt = boss.deathStartedAt || Date.now();

            if (Date.now() - deathStartedAt >= deathAnimationDuration + extraWinDelay) {
                this.endGame('win');
            }
        }
    }

    /**
     * Finalizes game state and triggers game-over callback.
     * @param {'win'|'lose'} result End result state.
     */
    endGame(result) {
        this.gameEnded = true;
        clearAllIntervals(); 

        if (this.gameOverCallback) {
            this.gameOverCallback(result);
        }
    }

    /**
     * Removes enemies marked as removable.
     */
    clearDeadEnemies() {
        if (this.level && this.level.enemies) {
            this.level.enemies = this.level.enemies.filter(enemy => !enemy.isRemoved);
        }
    }

    /**
     * Removes floating texts that finished their animation.
     */
    clearFloatingTexts() {
        this.floatingTexts = this.floatingTexts.filter(text => !text.isRemoved);
    }

    /**
     * Handles throw input, cooldown, ammo usage, and error sound.
     */
    checkTrowObjects() {
        const now = Date.now();

        if (this.keyboard.D && this.character.ammo >= 1) {
            if (now - this.lastThrowTime < this.throwCooldown) {
                return;
            }
            this.lastThrowTime = now;
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.character.ammo = Math.max(0, this.character.ammo - 1);
            this.ammoBar.setPercentage(this.character.ammo * 10);
        } else if (this.keyboard.D && this.character.ammo <= 0 && !isMuted) {
            this.wrong_bottle_sound.currentTime = 0;
            this.wrong_bottle_sound.play();
        }
    }

    /**
     * Resolves collisions between bottles and enemies.
     */
    checkBottleCollisions() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.isHit) return;

            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy, 6)) {
                    if (enemy instanceof Endboss) {
                        enemy.hit();
                        const maxHp = enemy.maxHp || 5;
                        const percentage = Math.max(0, (enemy.hp / maxHp) * 100);
                        this.bossBar.setPercentage(percentage);

                        bottle.isHit = true;
                        bottle.splashStart = new Date().getTime();
                        bottle.splashDuration = 200;
                        bottle.speedY = 0;
                        bottle.stoppedGravity = true;
                        bottle.acceleration = 0;
                    } else if (!enemy.chickenDead) {
                        enemy.hp -= 1;

                        let textX = enemy.x + (enemy.width / 2);
                        let textY = enemy.y - 10;
                        this.floatingTexts.push(new FloatingText('-1', textX, textY));

                        bottle.isHit = true;
                        bottle.splashStart = new Date().getTime();
                        bottle.splashDuration = 200;
                        bottle.speedY = 0;
                        bottle.stoppedGravity = true;
                        bottle.acceleration = 0;

                        if (enemy.hp <= 0) {
                            enemy.chickenDead = true;
                        }
                    }
                }
            });
        });
    }

    /**
     * Removes finished splash bottles and out-of-bounds projectiles.
     */
    clearThrowableObjects() {
        const now = new Date().getTime();
        this.throwableObjects = this.throwableObjects.filter(bottle => {
            if (bottle.isHit) {
                const elapsed = now - (bottle.splashStart || 0);
                return elapsed < (bottle.splashDuration || 200);
            }
            return bottle.y < 300;
        });
    }

    /**
     * Resolves collisions between character and enemies.
     */
    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy, 6)) {
                if (enemy instanceof Endboss) {
                    if (enemy.isAttacking && !enemy.isDead) {
                        this.character.hit(); 
                        this.healthBar.setPercentage(this.character.energy);
                    }
                }
                else if (enemy.isJumpable && this.character.speedY < 0 && this.character.y + this.character.height < enemy.y + enemy.height) {
                    if (enemy.isHit || enemy.chickenDead) return; // kein weiteres hochfedern, wenn Gegner bereits getroffen wurde
                    enemy.isHit = true;
                    enemy.hp -= 1;

                    let textX = enemy.x + (enemy.width / 2);
                    let textY = enemy.y - 10;
                    this.floatingTexts.push(new FloatingText('-1', textX, textY));
                    this.character.jump();
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
                if (enemy.chickenDead || this.character.speedY > 0) {
                    return;
                }
                this.character.hit();
                this.healthBar.setPercentage(this.character.energy);
            }
        });
    }

    /**
     * Resolves collisions between character and collectables.
     */
    checkCollectableCollisions() {
        this.level.collectables.forEach((item, index) => {
            if (this.character.isColliding(item, 4)) {

                if (item instanceof Coin) {
                    this.character.collectCoin(); // Erhöht z.B. ein internes Attribut im Charakter
                    this.scoreBar.setPercentage(this.character.coins); // Aktualisiert die Score-Bar

                    this.level.collectables.splice(index, 1);
                }

                else if (item instanceof Bottle) {
                    this.character.collectBottle(); // Erhöht z.B. die Munition im Charakter
                    this.ammoBar.setPercentage(this.character.ammo * 10); // Aktualisiert die Ammo-Bar in 10er Schritten (2/20% etc)
                    this.level.collectables.splice(index, 1);
                }
            }
        });
    }

    /**
     * Renders world layers and schedules the next animation frame.
     */
    draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.collectables);
        this.addObjectsToMap(this.level.enemies);
        
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.healthBar);
        this.addToMap(this.scoreBar);
        this.addToMap(this.ammoBar);

        let boss = this.level.enemies.find(e => e instanceof Endboss);
        if (boss && boss.bossActive && boss.hp > 0) {
            this.addToMap(this.bossBar);
        }

        // -------- Spaceholder for fixed objects ------------

        this.ctx.translate(this.camera_x, 0);

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

    /**
     * Draws all objects from an array to the world map.
     * @param {DrawableObject[]} objects Objects to render.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        })
    }

    /**
     * Draws one object, including horizontal flip handling.
     * @param {DrawableObject} mo Drawable world object.
     */
    addToMap(mo) {          
        if (mo.otherDirection) {     
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Temporarily flips drawing context for mirrored sprites.
     * @param {DrawableObject} mo Drawable world object.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores drawing context after mirrored rendering.
     * @param {DrawableObject} mo Drawable world object.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

}