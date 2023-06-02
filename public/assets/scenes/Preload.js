export default class Preload extends Phaser.Scene {
    // escena para optimiozar tiempos
    // carga el preload solo una vez y sirve para todo el juego
    constructor() {
      // key of the scene
      super("preload");
    }
  
    preload() {
      // load assets
      this.load.tilemapTiledJSON("map1", "./public/tilemaps/nivel1.json");
      this.load.tilemapTiledJSON("map2", "./public/tilemaps/nivel2.json");
  
      this.load.image("tilesBackground", "./public/assets/images/sky.png");
      this.load.image("tilesPlatform", "./public/assets/images/platform.png");
  
      this.load.image("star", "./public/assets/images/star.png");
  
      this.load.spritesheet("dude", "./public/assets/images/dude.png", {
        frameWidth: 32,
        frameHeight: 48,
      });
  
      this.load.image("exit", "./public/assets/images/exit.png");
    }
  
    create() {
      //  Our player animations, turning, walking left and walking right.
      // se crea una sola vez, para que no de error en el restart de la escena
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
  
      this.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 4 }],
        frameRate: 20,
      });
  
      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });
  
      // init scene juego
      this.scene.start("game");
    }
  }
  