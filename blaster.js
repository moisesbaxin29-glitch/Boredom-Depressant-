const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score-display');
const stageDisplay = document.getElementById('stage-display');

let player = { x: 185, y: 450, width: 30, height: 20, speed: 6 };
let projectiles = []; let enemies = []; let keys = { ArrowLeft: false, ArrowRight: false, Space: false };
let score = 0; let stage = 1; let frameCount = 0; let enemySpawnRate = 60; let enemySpeed = 2; let gameOver = false; let spacePressed = false;

window.addEventListener('keydown', function(e) {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') keys[e.code] = true;
    if (e.code === 'Space' && !spacePressed && !gameOver) {
        spacePressed = true;
        projectiles.push({ x: player.x + player.width/2 - 2, y: player.y, width: 4, height: 15 });
    }
});
window.addEventListener('keyup', function(e) {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') keys[e.code] = false;
    if (e.code === 'Space') spacePressed = false;
});

function spawnEnemy() {
    let size = 25; let x = Math.random() * (canvas.width - size);
    enemies.push({ x: x, y: -size, width: size, height: size });
}

function update() {
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x + player.width < canvas.width) player.x += player.speed;
    for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].y -= 7; if (projectiles[i].y < 0) projectiles.splice(i, 1);
    }
    frameCount++; if (frameCount % enemySpawnRate === 0) spawnEnemy();

    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i]; e.y += enemySpeed;
        if (e.y + e.height > canvas.height) return triggerGameOver();
        if (e.x < player.x + player.width && e.x + e.width > player.x && e.y < player.y + player.height && e.y + e.height > player.y) return triggerGameOver();

        for (let j = projectiles.length - 1; j >= 0; j--) {
            let p = projectiles[j];
            if (p.x < e.x + e.width && p.x + p.width > e.x && p.y < e.y + e.height && p.y + p.height > e.y) {
                enemies.splice(i, 1); projectiles.splice(j, 1);
                score += 100; scoreDisplay.innerText = score;
                if (score > 0 && score % 1000 === 0) { stage++; stageDisplay.innerText = stage; enemySpeed += 0.5; enemySpawnRate = Math.max(20, enemySpawnRate - 5); }
                break;
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ffcc'; ctx.shadowBlur = 10; ctx.shadowColor = '#00ffcc';
    ctx.beginPath(); ctx.moveTo(player.x + player.width/2, player.y); ctx.lineTo(player.x + player.width, player.y + player.height); ctx.lineTo(player.x, player.y + player.height); ctx.fill();
    ctx.fillStyle = '#ffff00'; ctx.shadowBlur = 5; ctx.shadowColor = '#ffff00';
    projectiles.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));
    ctx.fillStyle = '#ff0066'; ctx.shadowBlur = 10; ctx.shadowColor = '#ff0066';
    enemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height)); ctx.shadowBlur = 0;
}

function triggerGameOver() {
    gameOver = true;
    let name = prompt(`HULL BREACHED!\nScore: ${score}\nEnter your initials (max 8 chars):`);
    if (name === null) name = "ANON";

    if (typeof LeaderboardManager !== 'undefined') {
        LeaderboardManager.saveScore('blaster', name, score);
    }
    
    setTimeout(function() {
        window.location.href = 'score.html';
    }, 100);
}

function gameLoop() { if (gameOver) return; update(); draw(); requestAnimationFrame(gameLoop); }
gameLoop();