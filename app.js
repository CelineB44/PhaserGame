const config = {
  width: 900,
  height: 500,
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
    arcade:{
      gravity: {y: 450 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

let player;
let ennemy;
let cursors;
let platforms;
let stars;
let bombs;
let music;
let score = 0;
let gameOver = false;
let scoreText;

const game = new Phaser.Game(config)

function preload(){
  this.load.image('back', './images/sky.jpg')
  this.load.image('ground', './images/cloud.png')
  this.load.image('bomb', './images/assets/bomb.png')
  this.load.image('star', './images/assets/star.png')

  this.load.spritesheet('dude', './images/assets/perso/frame_gauche.png', { frameWidth: 50, frameHeight: 90 })
  this.load.spritesheet('dude2', './images/assets/ennemidroit.png', { frameWidth: 50, frameHeight: 90 });

  this.load.audio('theme', './music/fantasy.mp3')
  this.load.audio('dead', './music/dead.mp3')
}

function create(){

  music = this.sound.add ('theme');
  this.add.image(00, 100, 'back');

  music.play();

  platforms = this.physics.add.staticGroup();

  platforms.create(400, 568).setScale(2).refreshBody();

  // first cloud
  // platforms.create(100, 100, 'ground');
 
  // // second cloud(longeur,hauteur)
  platforms.create(450, 250, 'ground');

  player = this.physics.add.sprite(100, 450, 'dude');
  ennemy = this.physics.add.sprite(800, 450, 'dude2');
//  player.setScale(1); 

  // player.setBounce(0,1);
  player.setCollideWorldBounds(true);
  ennemy.setCollideWorldBounds(true);

// this.anims.create({
//     key: 'left',
//     frames: this.anims.generateFrameNumbers('dude', { start: './images/assets/perso/frame_gauche.png', end:  }),
//     frameRate: 10,
//     repeat: -1
// });

this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 1 } ],
    frameRate: 20
});

// this.anims.create({
//     key: 'right',
//     frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
//     frameRate: 10,
//     repeat: -1
// });

cursors = this.input.keyboard.createCursorKeys();

stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 34, y: 0, stepX: 100 }
});

stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
});

bombs = this.physics.add.group({
    key: 'bomb',
    repeat: 2,
    setXY: { x: 150, y: 130, stepX:200 }
});

scoreText = this.add.text(650, 16, 'Level 1: 0', { fontSize: '42px', fill: '#FFFFFF' })

this.physics.add.collider(player, platforms);
this.physics.add.collider(stars, platforms);
this.physics.add.collider(bombs, platforms);

this.physics.add.overlap(player, stars, collectStar, null, this);
this.physics.add.collider(player, bombs, hitBomb, null, this)

}

function update() {
  if (gameOver){
    this.add.text(220, 210, 'Game Over Looser!', 
    { fontFamily: 'Verdana',
      fontSize: 35 + 'px',
      color: 'black',
    }).setScrollFactor(0);
    music.stop();
  }  
  if (score === 70) {
    this.add.text (220, 210, 'You win!!',
    { fontFamily: 'Verdana',
    fontSize: 35 + 'px',
    color: 'black',
    }).setScrollFactor(0);
    music.stop()
  }
  if(cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  }

  else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  }

  else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  // if (cursors.up.isDown && player.body.touching.down) 
  if (cursors.up.isDown) {
    player.setVelocityY(-400);
  }
}

function collectStar (player, star) {
  star.disableBody(true, true);

  score += 10;
  scoreText.setText('Level 1: ' + score );

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function(child) {
      child.enableBody(true, child.x, 0, true,true);
    });

    const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    const bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setColliderWorldBounds(true);
    bomb.setVelocity(Phaser.Math.between (-200, 200), 20);
    bomb.allowGravity = false;
  }
}

function hitBomb (player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}
