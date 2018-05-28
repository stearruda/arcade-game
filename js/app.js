/*
 ****** GAME CONSTRUCTOR ******
*/

// Player and allEnemies Object as properties of Game Object
// Add Start and Game Over Screen
// Add Reset Game
// Update Top Panel
// Add Levels


let Game = function() {
/*
 ****** INSTANTIATE OBJECTS ******
*/
    // Place the player object in a variable called player
    this.player = new Player(200, 400);

    // Place all enemy objects in an array called allEnemies
    let enemy_1 = new Enemy(40);
    let enemy_2 = new Enemy(130);
    let enemy_3 = new Enemy(220);
    this.allEnemies = [enemy_1, enemy_2, enemy_3];

    // Score
    this.score = 0;

    // Level
    this.level = 0; 
};

Game.prototype.updateTopPanel = function() {
    // Update Level
    let level = document.querySelector('.level-number');
    level.innerHTML = this.level;
    // Update Lives
    let playerLives = document.querySelector('span.lives');
    playerLives.innerHTML = this.player.lives;
    // Update Score
    let playerScore = document.querySelector('.points');
    playerScore.innerHTML = this.player.points;
};

Game.prototype.startGettingInput = function(){

    const input = function(direction){
        myGame.player.handleInput(direction);
    }
    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        input(allowedKeys[e.keyCode]);
    });

    document.getElementById('arrow-up').addEventListener('click', function (){
        input('up');
    });

    document.getElementById('arrow-down').addEventListener('click', function (){
        input('down');
    });

    document.getElementById('arrow-left').addEventListener('click', function (){
        input('left');
    });

    document.getElementById('arrow-right').addEventListener('click', function (){
        input('right');
    });

};

Game.prototype.showStartScreen = function() {
    let startScreen = document.querySelector('#startScreen');
    startScreen.classList.add('show');

    let buttonPlay = document.querySelector('#playGame');
    buttonPlay.focus();
    buttonPlay.addEventListener('click', function() {
        startScreen.classList.remove('show');
        myGame.startGettingInput();
    });

    this.updateTopPanel();
};

Game.prototype.goToNextLevel = function(){
    // Level is increased and Top Panel is updated
    this.level++;
    for (let i = 0; i < this.allEnemies.length; i++) {
        this.allEnemies[i].goToNextLevel();
    };
    this.updateTopPanel();
};


// Shows Final Score and button to Play Again
Game.prototype.showGameOverScreen = function() {
    let gameOverScreen = document.querySelector('#gameOverScreen');
    gameOverScreen.classList.add('show');

    let finalScore = document.querySelector('.points-finalScore');
    finalScore.innerHTML = this.player.points;

    let buttonTryAgain = document.querySelector('#tryAgain');
    buttonTryAgain.focus();
    buttonTryAgain.addEventListener('click', function() {
        gameOverScreen.classList.remove('show');
        myGame.reset();
    });
};

Game.prototype.reset = function() {
    console.log('Reset Game');
    this.level = 0;
    this.player.reset();
    for(let i = 0; i < this.allEnemies.length; i++){
        this.allEnemies[i].reset();
    }
    this.updateTopPanel();

};

//Taken from https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/*
 ****** ENEMY CONSTRUCTOR ******
*/
// Enemies our player must avoid
let Enemy = function(y) {
    // Variables applied to each of our instances go here,

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.y = y;
    this.reset();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // https://discussions.udacity.com/t/how-do-i-define-the-enemys-speed/185100
    this.x = this.x + (this.speed * dt);
    
    if (this.x > 506) {
        this.x = -100;
    }
};

Enemy.prototype.reset = function(){
    this.speed = getRandomInt(50, 150);
    this.x = getRandomInt(0,500);
};

Enemy.prototype.goToNextLevel = function() {
    this.speed+= getRandomInt(30,100);
    this.x = getRandomInt(0,500);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// When enemy and player collision happen = they occupy the same space
Enemy.prototype.checkCollisions = function() {
    const player = myGame.player;
    // Check if enemy and player are at same line
    if (this.y === player.y) {
        // Check if enemy and player are touching horizontaly
        const enemyRightSideX = this.x + 101;
        const playerRightSideX = player.x + 101;
        if((enemyRightSideX > player.x) && !(playerRightSideX < this.x)){
            player.hit();
        }
    } 
};


/*
 ****** PLAYER CONSTRUCTOR ******
*/
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    // Variables applied to each of our instances go here,

    // The image/sprite for the player, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
    
    // Lives at Start
    this.lives = 4;

    // Points of Score 
    this.points = 0;

    this.backToInitialPosition();
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

Player.prototype.reset = function() {
    this.lives = 4;
    this.points = 0;
    this.backToInitialPosition();
};

Player.prototype.backToInitialPosition = function(){
    this.x = 200;
    this.y = 400;
};

// When Player have a collision with Enemy 
Player.prototype.hit = function(){
    this.backToInitialPosition();
    console.log('hit!');

    // Decrease lives when hit the Enemy
    this.lives--;

    myGame.updateTopPanel();

    // Game Over Screen shows up when Player has no more lives 
    if (this.lives === 0) {
        myGame.showGameOverScreen();
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// A level is added when Player reaches the "Water Block"
Player.prototype.goToNextLevel = function(){
    this.backToInitialPosition();

    // Score is increased
    this.points+= 10;

    myGame.goToNextLevel();

};

// Handle direction of Player
Player.prototype.handleInput = function(key) {
    // Top boundary 
    if (key === 'up') {
        this.y -= 90;

        // Check if Player reaches the "Water Block" = Next level
        if(this.y === -50) {
            this.goToNextLevel();
        }
    } else if (key === 'down') {
        this.y += 90;

        // Bottom boundary 
        if(this.y === 490) {
            this.y = 400;
        }
    } else if (key === 'left') {
        this.x -= 100;

        // Left boundary 
        if (this.x === -100) {
            this.x = 0;
        } 
    } else if (key === 'right') {
        this.x += 100;

        // Right boundary
        if (this.x === 500) {
            this.x = 400;
        }
    }
};

const myGame = new Game();

window.onload = function() {
    myGame.showStartScreen();
}