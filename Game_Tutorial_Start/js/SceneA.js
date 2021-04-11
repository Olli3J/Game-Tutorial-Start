class SceneA extends Phaser.Scene {
    map;
    player;
    snakeStartPoint;
    playerStartPoint;
    cursors; //controls
    keyA;
    keyD;
    inPlay = true; //boollean
    
  
    constructor(config) {
      super(config);
    }
    preload() {
      //screens
      
      //images
      this.load.image('tiles', 'assets/Nature_TileSet.png');
      this.load.image('background', 'assets/Nature_Background.png');
      //JSON
      this.load.tilemapTiledJSON('platform-map', 'assets/map1.json');
      //Enemy
      //Player
      this.load.spritesheet('player', 'assets/GameTutorialPlayer.png', {
        frameWidth: 16.5,
        frameHeight: 32
      });
  
  
    } //end of preload
  
    create() {
      this.createLevel1();
      this.createPlayerMovement();
      this.cameraAndControls();
  
    }//end of create
  
    update() {
      if (this.inPlay) {
        if (this.cursors.left.isDown || this.keyA.isDown) {
          this.player.setVelocityX(-130);
          if (this.player.body.blocked.down) {
            this.player.anims.play('walk', true);
          } else {
            this.player.anims.play('idle', true);
          }
          this.player.flipX = false;
        } else if (this.cursors.right.isDown || this.keyD.isDown) {
          this.player.setVelocityX(130);
          if (this.player.body.blocked.down) {
            this.player.anims.play('walk', true);
          } else {
            this.player.anims.play('idle', true);
          }
          this.player.flipX = true;
        } else {
          this.player.setVelocityX(0);
          this.player.anims.play('idle', true);
          
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space) && this.player.jumpCount < 2) {
          this.player.jumpCount++;
          this.player.setVelocityY(-200);
        } else if (this.player.body.blocked.down) {
          this.player.jumpCount = 0;
  
        }
      }
    }
  
    createLevel1() {
      this.add.image(280, 40, 'background').setScrollFactor(0, 0);
      //adding tilemap
      this.map = this.make.tilemap({ key: 'platform-map' });
      this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      //platform-tiles = the tiled name
      let tiles = this.map.addTilesetImage('game-tiles', 'tiles');
      let collisionLayer = this.map.createStaticLayer('collisionLayer', [tiles], 0, 0);
      collisionLayer.setCollisionBetween(1, 1000);
  
  
      //player
      this.playerStartPoint = SceneA.FindPoint(this.map, 'objectLayer', 'player', 'playerSpawn');
      this.player = this.physics.add.sprite(this.playerStartPoint.x, this.playerStartPoint.y, 'player');
      this.player.jumpCount = 0;
      this.player.setCollideWorldBounds(true);
      this.physics.add.collider(this.player, collisionLayer);
    
    } // end of class
    createPlayerMovement() {
      //player walk 
      this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player', {
          start: 1,
          end: 5
        }),
        frameRate: 10,
        repeat: -1
      });
      //this.player.anims.play('walk', true);
      this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('player', {
          start: 0,
          end: 0
        }),
      });
  
    }
    cameraAndControls() {
      //camera
      let camera = this.cameras.getCamera('');
      camera.startFollow(this.player);
      camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      //controls
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }
  
  
    static FindPoint(map, layer, type, name) {
      var loc = map.findObject(layer, function (object) {
        if (object.type === type && object.name === name) {
          return object;
        }
      });
      return loc
    }
    static FindPoints(map, layer, type) {
      var locs = map.filterObjects(layer, function (object) {
        if (object.type === type) {
          return object
        }
      });
      return locs
    }
  
  }