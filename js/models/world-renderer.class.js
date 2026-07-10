class WorldRenderer {

    /**
     * Creates renderer bound to one world instance.
     * @param {World} world World instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Renders world layers and schedules the next animation frame.
     */
    draw() {
        this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        this.drawScrollableLayers();
        this.drawHud();
        this.drawEffectsLayer();
        this.scheduleNextFrame();
    }

    /**
     * Draws background, collectables, enemies, character, and clouds.
     */
    drawScrollableLayers() {
        this.withCamera(() => {
            this.addObjectsToMap(this.world.level.backgroundObjects);
            this.addObjectsToMap(this.world.level.collectables);
            this.addObjectsToMap(this.world.level.enemies);
            this.addToMap(this.world.character);
        });
        this.withCamera(() => {
            this.addObjectsToMap(this.world.level.clouds);
        });
    }

    /**
     * Draws all fixed HUD elements.
     */
    drawHud() {
        this.addToMap(this.world.healthBar);
        this.addToMap(this.world.scoreBar);
        this.addToMap(this.world.ammoBar);
        if (this.shouldDrawBossBar()) {
            this.addToMap(this.world.bossBar);
        }
    }

    /**
     * Checks whether boss bar should be visible.
     * @returns {boolean} True when boss bar should be drawn.
     */
    shouldDrawBossBar() {
        const boss = this.world.getBoss();
        return !!(boss && boss.bossActive && boss.hp > 0);
    }

    /**
     * Draws floating combat text and throwable objects.
     */
    drawEffectsLayer() {
        this.withCamera(() => {
            this.world.floatingTexts.forEach((text) => text.draw(this.world.ctx));
            this.addObjectsToMap(this.world.throwableObjects);
        });
    }

    /**
     * Schedules the next render frame.
     */
    scheduleNextFrame() {
        requestAnimationFrame(() => {
            this.draw();
        });
    }

    /**
     * Executes drawing code in camera-translated coordinate space.
     * @param {() => void} callback Drawing callback.
     */
    withCamera(callback) {
        this.world.ctx.translate(this.world.camera_x, 0);
        callback();
        this.world.ctx.translate(-this.world.camera_x, 0);
    }

    /**
     * Draws all objects from an array to the world map.
     * @param {DrawableObject[]} objects Objects to render.
     */
    addObjectsToMap(objects) {
        objects.forEach((object) => this.addToMap(object));
    }

    /**
     * Draws one object, including horizontal flip handling.
     * @param {DrawableObject} object Drawable world object.
     */
    addToMap(object) {
        if (object.otherDirection) {
            this.flipImage(object);
        }
        object.draw(this.world.ctx);
        object.drawFrame(this.world.ctx);
        if (object.otherDirection) {
            this.flipImageBack(object);
        }
    }

    /**
     * Temporarily flips drawing context for mirrored sprites.
     * @param {DrawableObject} object Drawable world object.
     */
    flipImage(object) {
        this.world.ctx.save();
        this.world.ctx.translate(object.width, 0);
        this.world.ctx.scale(-1, 1);
        object.x = object.x * -1;
    }

    /**
     * Restores drawing context after mirrored rendering.
     * @param {DrawableObject} object Drawable world object.
     */
    flipImageBack(object) {
        object.x = object.x * -1;
        this.world.ctx.restore();
    }
}
