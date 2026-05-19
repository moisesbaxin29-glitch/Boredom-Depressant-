// Get HTML Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score-display');
const startBtn = document.getElementById('start-btn');

// Game State Tracking
let gameRunning = false;
let score = 0;
let scoreTimer;

// Player Box Object (Positioned at the bottom center)
let player = {
    x: 185,
    y: 360,
    width: 30,
    height: 30,
    speed: 7,
    color: '#00ffcc'
};

// Enemy Blocks Array (Holds multiple falling items)
let enemies = [];
let enemySpeed = 4;
let spawnRate = 30; // Spawns a block every 30 frames
let frameCount = 0;

// Track which keys are currently pressed down
let keys = {
    ArrowLeft: false,
    ArrowRight: false
};

// Event Listeners for Movement Controls
window.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keys[e.key] = true;
    }
});

window.addEventListener('keyup', function(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keys[e.key] = false;
    }
});

// Click event to trigger or restart the game loop
startBtn.addEventListener('click', function() {
    if (!gameRunning) {
        resetGame();
        gameRunning = true;
        startBtn.style.display = 'none'; // Hide button during play
        
        // Timer that increases score by 1 every second
        scoreTimer = setInterval(function() {
            score = score + 1;
            scoreDisplay.innerText = score;
            
            // Every 5 seconds, slightly increase falling speed to make it harder
            if (score % 5 === 0) {
                enemySpeed = enemySpeed + 1;
            }
        }, 1000);

        gameLoop();
    }
});

function resetGame() {
    score = 0;
    enemySpeed = 4;
    enemies = [];
    player.x = 185; // Move player back to center
    scoreDisplay.innerText = "0";
    frameCount = 0;
}

// Simple logic function to spawn a falling square obstacle
function spawnEnemy() {
    let randomX = Math.floor(Math.random() * (canvas.width - 25));
    let newEnemy = {
        x: randomX,
        y: -25,
        width: 25,
        height: 25,
        color: '#ff0066'
    };
    enemies.push(newEnemy);
}

// Main Continuous Animation Loop
function gameLoop() {
    if (!gameRunning) return;

    // Clear the drawing canvas before updating positions
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Move Player Left/Right based on keys object status
    if (keys.ArrowLeft === true && player.x > 0) {
        player.x = player.x - player.speed;
    }
    if (keys.ArrowRight === true && player.x < (canvas.width - player.width)) {
        player.x = player.x + player.speed;
    }

    // Draw the Player Box onto canvas
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 2. Manage Falling Enemies
    frameCount = frameCount + 1;
    if (frameCount % spawnRate === 0) {
        spawnEnemy();
    }

    // Loop backward through the list to safely move and remove items
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y = enemies[i].y + enemySpeed;

        // Draw individual enemy box
        ctx.fillStyle = enemies[i].color;
        ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);

        // Standard AABB bounding box collision check formula
        if (player.x < enemies[i].x + enemies[i].width &&
            player.x + player.width > enemies[i].x &&
            player.y < enemies[i].y + enemies[i].height &&
            player.y + player.height > enemies[i].y) {
            
            // Trigger Game Over State
            gameOver();
            return;
        }

        // Delete blocks that fall off the bottom of the screen
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
        }
    }

    // Request browser animation frame to loop
    requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameRunning = false;
    clearInterval(scoreTimer);
    
    // Draw Game Over text splash directly on the canvas screen
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#ff0066";
    ctx.font = "20px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    
    // Bring back the start button so they can try again
    startBtn.innerText = "TRY AGAIN";
    startBtn.style.display = 'inline-block';
}