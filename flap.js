const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('scoreVal');

let player = { x: 50, y: 250, size: 20, velocity: 0, gravity: 0.5, thrust: -7 };
let lasers = []; let frameCount = 0; let score = 0; let scrollSpeed = 3; let gameOver = false; let gameStarted = false;

window.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!gameStarted) gameStarted = true;
        if (!gameOver) player.velocity = player.thrust;
    }
});

function spawnLaser() {
    let gap = 140 - Math.min(score, 50);
    let minHeight = 50; let maxTopHeight = canvas.height - gap - minHeight;
    let topHeight = Math.floor(Math.random() * (maxTopHeight - minHeight + 1)) + minHeight;
    lasers.push({ x: canvas.width, y: 0, width: 30, topHeight: topHeight, bottomY: topHeight + gap, passed: false });
}

function update() {
    if (!gameStarted) return;
    player.velocity += player.gravity; player.y += player.velocity;
    if (player.y <= 0 || player.y + player.size >= canvas.height) return triggerGameOver();

    frameCount++; if (frameCount % 90 === 0) spawnLaser();

    for (let i = lasers.length - 1; i >= 0; i--) {
        let l = lasers[i]; l.x -= scrollSpeed;
        let hitTop = player.x < l.x + l.width && player.x + player.size > l.x && player.y < l.topHeight;
        let hitBottom = player.x < l.x + l.width && player.x + player.size > l.x && player.y + player.size > l.bottomY;
        if (hitTop || hitBottom) return triggerGameOver();
        if (l.x + l.width < player.x && !l.passed) {
            l.passed = true; score += 10; scoreEl.innerText = score;
            if (score % 50 === 0) scrollSpeed += 0.5;
        }
        if (l.x + l.width < 0) lasers.splice(i, 1);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff0066'; ctx.shadowBlur = 10; ctx.shadowColor = '#ff0066';
    lasers.forEach(l => { ctx.fillRect(l.x, l.y, l.width, l.topHeight); ctx.fillRect(l.x, l.bottomY, l.width, canvas.height - l.bottomY); });
    ctx.fillStyle = '#00ffcc'; ctx.shadowBlur = 10; ctx.shadowColor = '#00ffcc';
    ctx.fillRect(player.x, player.y, player.size, player.size);
    ctx.shadowBlur = 0;
    if (!gameStarted) {
        ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "#fff"; ctx.font = "14px 'Press Start 2P'"; ctx.fillText("PRESS SPACE TO START", 60, canvas.height/2);
    }
}

function triggerGameOver() {
    gameOver = true;
    let name = prompt(`CRITICAL FAILURE!\nScore: ${score}\nEnter your initials (max 8 chars):`);
    if (name === null) name = "ANON";

    if (typeof LeaderboardManager !== 'undefined') {
        LeaderboardManager.saveScore('flap', name, score);
    }
    
    setTimeout(function() {
        window.location.href = 'score.html';
    }, 100);
}

function loop() { if (gameOver) return; update(); draw(); requestAnimationFrame(loop); }
loop();