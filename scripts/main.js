var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 }
        }
    },
    scene: {
        preload: preload, // loading assets | images and such
        create: create, // creating | using of assets n such
        update: update // game clock, loop, time | game logic
    }
};

const game = new Phaser.Game(config);
let ground, player, 
platforms, platform, 
fruit, fruits,
scoreText;
let score = 0;

function preload ()
{
    // loading of assets
    this.load.image('background', './assets/background/background.jpg');
    this.load.image('barrel', './assets/player/barrel.png');
    this.load.image('fruit', './assets/misc/watermelon.png');
    this.load.image('platform', './assets/misc/platform.jpg');
}

function create ()
{
    this.physics.start()
    // background image
    this.add.image(900, 400, 'background');

    // creating platforms using static group
    platforms = this.physics.add.staticGroup()
    platforms.enableBody = true

    for ( i = 0; i < 4; i ++)
    {
        ground = platforms.create(i * 660, 1080 - 64, 'platform')
            .setScale(.3)
            .refreshBody()      // required, to apply the changes made in static group
    }
    platform = platforms.create(1600, 400, 'platform')
        .setScale(.2)
        .refreshBody()
    platform = platforms.create(450, 700, 'platform')
        .setScale(.2)
        .refreshBody()

    // creating player
    player = this.physics.add.image(50, 700, 'barrel')
        .setScale(.4)
        .setBounce(.3)
        .setCollideWorldBounds(true)

    // creating fruits
    fruits = this.physics.add.group({   // create a dyanamic group for the fruits
        key: 'fruit',
        repeat: 12,     // count of fruits to be created
        setXY: { x: 200, y: 0, stepX: 135 }     // x,y is for location while stepX is the distance between the fruits
    });

    fruits.children.iterate(function (child) {  // iterate all children then set bounceY between .4 and .8
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '64px', fill: '#000000' }); // score text
    cursors = this.input.keyboard.createCursorKeys(); // keyboard controls
}

function update ()
{
    // collision detectors
    this.physics.add.collider(player, platforms)
    this.physics.add.collider(fruits, platforms)
    this.physics.add.overlap(player,fruits, fruitCollect, null, this)

    // player controls
    if (cursors.left.isDown) { player.setVelocityX(-600) }

    else if (cursors.right.isDown) { player.setVelocityX(600) }

    else { player.setVelocityX(0) }
    
    if (cursors.up.isDown && player.body.touching.down) { player.setVelocityY(-1200) }
}

// called when overlap happens between player and fruits | line 84
function fruitCollect(player, fruit) {
    fruit.disableBody(true, true);  // remove fruit
    score += 10 ;
    scoreText.setText('Score: ' + score);

    // win condition
    if (score == 130)
    {
        alert("Y O U  W O N !\nC O N G R A T S ! ! !")
        score = 0;
    }
}