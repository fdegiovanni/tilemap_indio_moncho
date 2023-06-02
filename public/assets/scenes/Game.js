// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("game");
  }

  create() {
    const map = this.make.tilemap({ key: "map1" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const backgroundTilesLayer = map.addTilesetImage("sky", "tilesBackground");
    const platformTilesLayer = map.addTilesetImage("platform", "tilesPlatform");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const backgroundLayer = map.createLayer("fondo", backgroundTilesLayer, 0, 0);
    const platformLayer = map.createLayer(
      "plataformas",
      platformTilesLayer,
      0,
      0
    );
    const objectLayer = map.getObjectLayer("objetos");

    platformLayer.setCollisionByProperty({ colision: true });

    console.log(objectLayer);

    // crear el jugador
    // Find in the Object Layer, the name "dude" and get position
    const spawnPoint = map.findObject(
      "objetos",
      (obj) => obj.name === "jugador"
    );
    console.log(spawnPoint);
    // The player and its settings
    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create empty group of starts
    this.stars = this.physics.add.group();

    // find object layer
    // if type is "stars", add to stars group
    objectLayer.objects.forEach((objData) => {
      //console.log(objData.name, objData.type, objData.x, objData.y);

      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "estrella": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          const star = this.stars.create(x, y, "star");
          break;
        }
        case "salida": {
          this.exit = this.physics.add
          .sprite(x, y, "exit")
          .setScale(0.2);
          this.exit.visible = false;
          break;
        }
      }
    });

    this.physics.add.collider(this.player, platformLayer);
    this.physics.add.collider(this.stars, platformLayer);
    this.physics.add.collider(
      this.player,
      this.stars,
      this.recollect,
      null,
      this
    );
    this.physics.add.collider(this.exit, platformLayer);
    this.physics.add.overlap(
      this.player,
      this.exit,
      this.isWinner,
      null, //() => this.stars.getTotalUsed() === 0, // condicion de ejecucion
      this
    );

    this.score = 0;
    this.scoreText = this.add.text(10, 20, `Nivel: 1 - Score: ${this.score}`);

  }

  update() {
    //move left
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    }
    //move right
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    }
    //stop
    else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    //jump
    if (this.cursors.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-330);
    }
  }

  recollect(jugador, star) {
    star.disableBody(true, true);
    this.score++;
    this.scoreText.setText(`Nivel: 1 - Score: ${this.score}`);
    this.exit.visible = true;
    // if(this.stars.getTotalUsed() === 0) {
    //   this.exit.visible = true;
    // }
  }

  isWinner(){
    this.scene.start("game2", {
      score: this.score,
    });
  }
}
