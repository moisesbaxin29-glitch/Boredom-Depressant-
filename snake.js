const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('scoreVal');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{x: 10, y: 10}];
let velocity = {x: 0, y: 0};
let food = {x: 15, y: 15};
let score = 0; let speed = 150; let lastRenderTime = 0; let gameOver = false; let gameStarted = false;

window.addEventListener('keydown', e => {
    if (gameOver) return;
    if (!gameStarted && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) gameStarted = true;
    switch (e.key) {
        case 'ArrowUp': if (velocity.y !== 1) velocity = {x: 0, y: -1}; break;
        case 'ArrowDown': if (velocity.y !== -1) velocity = {x: 0, y: 1}; break;
        case 'ArrowLeft': if (velocity.x !== 1) velocity = {x: -1, y: 0}; break;
        case 'ArrowRight': if (velocity.x !== -1) velocity = {x: 1, y: 0}; break;
    }
});

function update() {
    if (!gameStarted) return;
    const head = {x: snake[0].x + velocity.x, y: snake[0].y + velocity.y};
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return triggerGameOver();
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) return triggerGameOver();

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 100; scoreEl.innerText = score; speed = Math.max(50, speed - 2); spawnFood();
    } else { snake.pop(); }
}

function spawnFood() {
    food = {x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount)};
    if (snake.some(s => s.x === food.x && s.y === food.y)) spawnFood();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff0066'; ctx.shadowBlur = 10; ctx.shadowColor = '#ff0066';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    ctx.fillStyle = '#33ff33'; ctx.shadowBlur = 10; ctx.shadowColor = '#33ff33';
    snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2));
    ctx.shadowBlur = 0;
}

function triggerGameOver() {
    gameOver = true;
    let name = prompt(`GAME OVER!\nScore: ${score}\nEnter your initials (max 8 chars):`);
    if (name === null) name = "ANON";

    if (typeof LeaderboardManager !== 'undefined') {
        LeaderboardManager.saveScore('snake', name, score);
    }
    
    setTimeout(function() {
        window.location.href = 'score.html';
    }, 100);
}

function loop(currentTime) {
    if (gameOver) return;
    window.requestAnimationFrame(loop);
    if ((currentTime - lastRenderTime) < speed) return;
    lastRenderTime = currentTime;
    update(); draw();
}
ctx.fillStyle = '#33ff33'; ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 2, gridSize - 2);
window.requestAnimationFrame(loop);