// Get HTML Elements
const clickZone = document.getElementById('click-zone');
const zoneText = document.getElementById('zone-text');
const currentScoreDisplay = document.getElementById('current-score');
const bestScoreDisplay = document.getElementById('best-score');
const levelDisplay = document.getElementById('level-display');

// Game Flow Variables
let gameState = "start"; 
let currentLevel = 1;
let startTime = 0;
let endTime = 0;
let timeoutTimer;
let timeoutTimer2;

// Level 3 Counters
let level3ClicksNeeded = 2; 
let level3Phase = 1; 

// Level 4 Target Picker
let level4TargetColor = ""; 

// Check local storage for high scores
let savedBest = localStorage.getItem('reactionBestScore');
if (savedBest !== null) {
    bestScoreDisplay.innerText = savedBest;
}

// Reset function if a player fails or finishes
function resetToFail(message) {
    clearTimeout(timeoutTimer);
    clearTimeout(timeoutTimer2);
    gameState = "result";
    clickZone.className = "start-state";
    clickZone.style.height = "300px"; // Reset Level 5 size change
    zoneText.innerText = message;
    currentLevel = 1; // Send them back to level 1
    levelDisplay.innerText = "LEVEL: 1/5";
}

// Main Click Event Logic
clickZone.addEventListener('click', function() {

    // --- GAME STARTING / RESET LOOP ---
    if (gameState === "start" || gameState === "result") {
        gameState = "waiting";
        clickZone.className = "waiting-state";
        clickZone.style.height = "300px"; 
        zoneText.innerText = "GET READY...";
        levelDisplay.innerText = "LEVEL: " + currentLevel + "/5";

        let randomDelay = Math.floor(Math.random() * 2000) + 1500; // 1.5 to 3.5 seconds

        // --- LEVEL 1 LOGIC ---
        if (currentLevel === 1) {
            timeoutTimer = setTimeout(function() {
                gameState = "clickMe";
                clickZone.className = "click-state"; // Turns Green
                zoneText.innerText = "CLICK!";
                startTime = Date.now();
            }, randomDelay);
        }

        // --- LEVEL 2 LOGIC (The Fake Out) ---
        else if (currentLevel === 2) {
            timeoutTimer = setTimeout(function() {
                gameState = "fakeout";
                clickZone.className = "blue-state"; // Turns Blue to trick them
                zoneText.innerText = "DON'T CLICK!";
                
                // If they don't fall for it, show Green 1.2 seconds later
                timeoutTimer2 = setTimeout(function() {
                    gameState = "clickMe";
                    clickZone.className = "click-state"; // Turns Green
                    zoneText.innerText = "CLICK NOW!";
                    startTime = Date.now();
                }, 1200);

            }, randomDelay);
        }

        // --- LEVEL 3 LOGIC (Pattern Click Challenge) ---
        else if (currentLevel === 3) {
            level3ClicksNeeded = 2;
            level3Phase = 1;
            timeoutTimer = setTimeout(function() {
                gameState = "clickMePattern";
                clickZone.className = "click-state"; // Turns Green
                zoneText.innerText = "CLICK 2 TIMES!";
                startTime = Date.now();
            }, randomDelay);
        }

        // --- LEVEL 4 LOGIC (Color Matching Chaos) ---
        else if (currentLevel === 4) {
            // Randomly choose if they need to click Blue or Yellow
            if (Math.random() > 0.5) {
                level4TargetColor = "BLUE";
            } else {
                level4TargetColor = "YELLOW";
            }
            zoneText.innerText = "TARGET: " + level4TargetColor;

            timeoutTimer = setTimeout(function() {
                gameState = "colorChaos";
                // Show a random wrong color first
                if (level4TargetColor === "BLUE") {
                    clickZone.className = "yellow-state";
                } else {
                    clickZone.className = "blue-state";
                }

                // Swap to correct target color 1 second later
                timeoutTimer2 = setTimeout(function() {
                    if (level4TargetColor === "BLUE") {
                        clickZone.className = "blue-state";
                    } else {
                        clickZone.className = "yellow-state";
                    }
                    zoneText.innerText = "HIT IT!";
                    startTime = Date.now();
                }, 1000);

            }, randomDelay);
        }

        // --- LEVEL 5 LOGIC (Hyper Speed + Small Target) ---
        else if (currentLevel === 5) {
            // Shrink the screen target size to make it hard
            clickZone.style.height = "130px"; 
            
            timeoutTimer = setTimeout(function() {
                gameState = "clickMe";
                clickZone.className = "click-state";
                zoneText.innerText = "NOW!";
                startTime = Date.now();
            }, 800); // Extremely fast fixed delay
        }
    }

    // --- DURING-GAME CLICK CHECKS ---
    else if (gameState === "waiting" || gameState === "fakeout") {
        // Player clicked early or fell for the Level 2 Blue fakeout!
        resetToFail("FAILED! YOU CLICKED EARLY. RESTARTING...");
    }

    else if (gameState === "colorChaos") {
        // Check if the card is currently showing the correct color matching our instructions
        if ((level4TargetColor === "BLUE" && clickZone.className === "blue-state") || 
            (level4TargetColor === "YELLOW" && clickZone.className === "yellow-state")) {
            handleLevelPass();
        } else {
            resetToFail("WRONG COLOR CHOICE! RESTARTING...");
        }
    }

    else if (gameState === "clickMePattern") {
        if (level3Phase === 1) {
            level3ClicksNeeded = level3ClicksNeeded - 1;
            zoneText.innerText = level3ClicksNeeded + " MORE!";
            if (level3ClicksNeeded === 0) {
                // Switch directly to phase 2 (Purple state)
                level3Phase = 2;
                level3ClicksNeeded = 3;
                clickZone.className = "purple-state";
                zoneText.innerText = "CLICK 3 TIMES!";
            }
        } else if (level3Phase === 2) {
            level3ClicksNeeded = level3ClicksNeeded - 1;
            zoneText.innerText = level3ClicksNeeded + " MORE!";
            if (level3ClicksNeeded === 0) {
                handleLevelPass();
            }
        }
    }

    else if (gameState === "clickMe") {
        handleLevelPass();
    }
});

// Runs when a player successfully clicks the correct item inside a level window
function handleLevelPass() {
    endTime = Date.now();
    let score = endTime - startTime;
    currentScoreDisplay.innerText = score;

    if (currentLevel < 5) {
        // Advance to next level
        currentLevel = currentLevel + 1;
        gameState = "result";
        clickZone.className = "start-state";
        zoneText.innerText = "PASS! CLICK FOR LEVEL " + currentLevel;
    } else {
        // Beat Level 5 - Game won!
        gameState = "result";
        clickZone.className = "click-state";
        clickZone.style.height = "300px";
        zoneText.innerText = "YOU BEAT THE ARCADE! Click to replay.";
        
        // High score system logic comparison
        let currentBest = parseInt(bestScoreDisplay.innerText);
        if (currentBest === 0 || score < currentBest) {
            localStorage.setItem('reactionBestScore', score);
            bestScoreDisplay.innerText = score;
        }
        currentLevel = 1; // Reset levels back to beginning
    }
}