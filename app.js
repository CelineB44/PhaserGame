
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

const game = new Phaser.Game(config)
let dude;
let cursors;

function preload(){
  this.load.image('back', './images/sky.jpg')
  this.load.image('dude', './images/bomb.png')
}

function create(){

  this.add.image(00, 100, 'back');
  // this.add.image(100, 100, 'dude').setScrollFactor(0);
  // dude.scale.setTo(0.8,0.8)
  dude = this.physics.add.image(100, 100, 'dude')
  dude.body.collideWorldBounds = true;

  cursors = this.input.keyboard.createCursorKeys()
  console.log(cursors)
}

function update() {
  dude.setVelocityX(0)

  if(cursors.up.isDown) {
    dude.setVelocity(0, -300)
  } 
  if(cursors.right.isDown) {
    dude.setVelocity(300, 0)
  } 
  if(cursors.left.isDown) {
    dude.setVelocity(-300, 0)
  }
}