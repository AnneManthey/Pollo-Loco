class Level {
    enemies;
    collectables;
    clouds;
    backgroundObjects;
    level_end_x =2200;

    /**
     * Creates a level with all world object groups.
     * @param {MovableObject[]} enemies Enemy objects in the level.
     * @param {Cloud[]} clouds Background cloud objects.
     * @param {Collectables[]} collectables Collectable world items.
     * @param {BackgroundObject[]} backgroundObjects Parallax background tiles.
     */
    constructor(enemies, clouds, collectables, backgroundObjects){
        this.enemies = enemies;
        this.clouds = clouds;
        this.collectables = collectables;
        this.backgroundObjects = backgroundObjects;
    }
}