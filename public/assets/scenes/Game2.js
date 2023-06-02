// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game2 extends Phaser.Scene {
  constructor() {
    super("game2");
  }

  init({ score }) {
    this.score = score;
  }

  create() {
    const map = this.make.tilemap({ key: "map2" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const backgroundTilesLayer = map.addTilesetImage("sky", "tilesBackground");
    const platformTilesLayer = map.addTilesetImage("platform", "tilesPlatform");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const backgroundLayer = map.createLayer(
      "fondo",
      backgroundTilesLayer,
      0,
      0
    );
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
          this.exit = this.physics.add.sprite(x, y, "exit").setScale(0.2);
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
      () => this.stars.getTotalUsed() === 0, // condicion de ejecucion
      this
    );

    // add camara to follow player
    this.cameras.main.startFollow(this.player);

    // world bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // camara dont go out of the map
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.scoreText = this.add.text(10, 20, `Nivel: 2 - Score: ${this.score}`);
    // fijar texto para que no se mueva con la camara
    this.scoreText.setScrollFactor(0);
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
    this.scoreText.setText(`Nivel: 2 - Score: ${this.score}`);
    if (this.stars.getTotalUsed() === 0) {
      this.exit.visible = true;
    }
  }

  isWinner() {
    this.scene.start("win", {
      score: this.score,
    });
  }
}
