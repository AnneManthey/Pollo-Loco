class WorldCollisionSystem {

    /**
     * Creates collision/interaction system bound to one world.
     * @param {World} world World instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Resolves collisions between bottles and enemies.
     */
    checkBottleCollisions() {
        this.world.throwableObjects.forEach((bottle) => {
            if (!bottle.isHit) {
                this.checkBottleAgainstEnemies(bottle);
            }
        });
    }

    /**
     * Removes finished splash bottles and out-of-bounds projectiles.
     */
    clearThrowableObjects() {
        const now = Date.now();
        this.world.throwableObjects = this.world.throwableObjects.filter((bottle) => {
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
        this.world.level.enemies.forEach((enemy) => {
            if (this.world.character.isColliding(enemy, 6)) {
                this.handleCharacterEnemyCollision(enemy);
            }
        });
    }

    /**
     * Resolves collisions between character and collectables.
     */
    checkCollectableCollisions() {
        this.world.level.collectables.forEach((item, index) => {
            if (this.world.character.isColliding(item, 4)) {
                this.collectItem(item, index);
            }
        });
    }

    /**
     * Checks one bottle against all enemies.
     * @param {ThrowableObject} bottle Active bottle projectile.
     */
    checkBottleAgainstEnemies(bottle) {
        this.world.level.enemies.forEach((enemy) => {
            if (bottle.isHit || !bottle.isColliding(enemy, 6)) {
                return;
            }
            this.handleBottleEnemyCollision(bottle, enemy);
        });
    }

    /**
     * Handles bottle collision result based on enemy type.
     * @param {ThrowableObject} bottle Active bottle projectile.
     * @param {MovableObject} enemy Enemy hit by bottle.
     */
    handleBottleEnemyCollision(bottle, enemy) {
        if (enemy instanceof Endboss) {
            this.handleBossBottleHit(bottle, enemy);
            return;
        }
        this.handleChickenBottleHit(bottle, enemy);
    }

    /**
     * Applies bottle hit on endboss and updates boss bar.
     * @param {ThrowableObject} bottle Active bottle projectile.
     * @param {Endboss} boss Endboss instance.
     */
    handleBossBottleHit(bottle, boss) {
        boss.hit();
        this.syncBossBar(boss);
        this.markBottleAsSplashed(bottle);
    }

    /**
     * Updates boss bar to match current boss hp.
     * @param {Endboss} boss Endboss instance.
     */
    syncBossBar(boss) {
        const maxHp = boss.maxHp || 5;
        const percentage = Math.max(0, (boss.hp / maxHp) * 100);
        this.world.bossBar.setPercentage(percentage);
    }

    /**
     * Applies bottle hit on chicken-type enemies.
     * @param {ThrowableObject} bottle Active bottle projectile.
     * @param {MovableObject} enemy Chicken-type enemy.
     */
    handleChickenBottleHit(bottle, enemy) {
        if (enemy.chickenDead) {
            return;
        }
        enemy.hp -= 1;
        this.addDamageText(enemy);
        this.markBottleAsSplashed(bottle);
        if (enemy.hp <= 0) {
            enemy.chickenDead = true;
        }
    }

    /**
     * Marks bottle as hit and starts short splash state.
     * @param {ThrowableObject} bottle Active bottle projectile.
     */
    markBottleAsSplashed(bottle) {
        bottle.isHit = true;
        bottle.splashStart = Date.now();
        bottle.splashDuration = 200;
        bottle.speedY = 0;
        bottle.stoppedGravity = true;
        bottle.acceleration = 0;
    }

    /**
     * Adds floating damage text above an enemy.
     * @param {MovableObject} enemy Enemy to annotate.
     */
    addDamageText(enemy) {
        const textX = enemy.x + (enemy.width / 2);
        const textY = enemy.y - 10;
        this.world.floatingTexts.push(new FloatingText('-1', textX, textY));
    }

    /**
     * Resolves one collision between character and enemy.
     * @param {MovableObject} enemy Enemy colliding with character.
     */
    handleCharacterEnemyCollision(enemy) {
        if (enemy instanceof Endboss) {
            this.handleCharacterBossCollision(enemy);
            return;
        }
        if (this.handleJumpAttackCollision(enemy)) {
            return;
        }
        if (!enemy.chickenDead && this.world.character.speedY <= 0) {
            this.damageCharacter();
        }
    }

    /**
     * Applies boss contact damage while boss is attacking.
     * @param {Endboss} boss Endboss instance.
     */
    handleCharacterBossCollision(boss) {
        if (this.handleBossJumpAttackCollision(boss)) {
            return;
        }
        if (boss.isAttacking && !boss.isDead) {
            this.damageCharacter();
        }
    }

    /**
     * Handles jump attack collision on the endboss.
     * @param {Endboss} boss Endboss collided with character.
     * @returns {boolean} True when jump attack was processed.
     */
    handleBossJumpAttackCollision(boss) {
        if (!this.canApplyBossJumpAttack(boss)) {
            return false;
        }
        boss.hit();
        this.syncBossBar(boss);
        this.addDamageText(boss);
        this.bounceCharacterAfterJumpAttack();
        return true;
    }

    /**
     * Checks whether character can damage endboss via jump attack.
     * @param {Endboss} boss Endboss collided with character.
     * @returns {boolean} True when boss jump attack is valid.
     */
    canApplyBossJumpAttack(boss) {
        if (boss.isDead || this.world.character.speedY >= 0) {
            return false;
        }
        return this.world.character.y + this.world.character.height < boss.y + boss.height;
    }

    /**
     * Handles jump attack collision on jumpable enemies.
     * @param {MovableObject} enemy Enemy collided with character.
     * @returns {boolean} True when jump attack was processed.
     */
    handleJumpAttackCollision(enemy) {
        if (!this.canApplyJumpAttack(enemy)) {
            return false;
        }
        enemy.isHit = true;
        enemy.hp -= 1;
        this.addDamageText(enemy);
        this.bounceCharacterAfterJumpAttack();
        this.updateEnemyAfterJumpAttack(enemy);
        return true;
    }

    /**
     * Checks whether jump attack conditions are met.
     * @param {MovableObject} enemy Enemy collided with character.
     * @returns {boolean} True when jump attack can be applied.
     */
    canApplyJumpAttack(enemy) {
        if (!enemy.isJumpable || enemy.isHit || enemy.chickenDead) {
            return false;
        }
        if (this.world.character.speedY >= 0) {
            return false;
        }
        return this.world.character.y + this.world.character.height < enemy.y + enemy.height;
    }

    /**
     * Applies bounce effect after successful jump attack.
     */
    bounceCharacterAfterJumpAttack() {
        this.world.character.jump();
        this.world.character.speedY = 15;
    }

    /**
     * Updates enemy state after jump attack damage.
     * @param {MovableObject} enemy Enemy hit by jump attack.
     */
    updateEnemyAfterJumpAttack(enemy) {
        if (enemy.hp <= 0) {
            enemy.chickenDead = true;
            return;
        }
        setTimeout(() => {
            enemy.isHit = false;
        }, 200);
    }

    /**
     * Applies character damage and syncs health bar.
     */
    damageCharacter() {
        this.world.character.hit();
        this.world.healthBar.setPercentage(this.world.character.hp);
    }

    /**
     * Applies collectable effect and removes collected item.
     * @param {Collectables} item Collected item.
     * @param {number} index Index in collectables array.
     */
    collectItem(item, index) {
        if (item instanceof Coin) {
            this.collectCoin(index);
            return;
        }
        if (item instanceof Bottle) {
            this.collectBottle(index);
        }
    }

    /**
     * Handles coin pickup and score bar update.
     * @param {number} index Index in collectables array.
     */
    collectCoin(index) {
        this.world.character.collectCoin();
        this.world.scoreBar.setPercentage(this.world.character.coins);
        this.world.level.collectables.splice(index, 1);
    }

    /**
     * Handles bottle pickup and ammo bar update.
     * @param {number} index Index in collectables array.
     */
    collectBottle(index) {
        this.world.character.collectBottle();
        this.world.ammoBar.setPercentage(this.world.character.ammo * 10);
        this.world.level.collectables.splice(index, 1);
    }
}
