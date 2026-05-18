// HTML element selectors
const gridContainer = document.getElementById('grid-container');
const timerDisplay = document.getElementById('timer-display');
const msgDisplay = document.getElementById('msg-display');

// Game variables using simple data types
let timeLeft = 45;
let gameTimer;
let gameStarted = false;

// 8 pairs of basic text icons for our retro arcade theme
let cardIcons = ['★', '★', '◆', '◆', '▲', '▲', '●', '●', '👾', '👾', '🕹️', '🕹️', '💀', '💀', '⚡', '⚡'];

// Variables to keep track of player choices
let firstCard = null;
let secondCard = null;
let lockBoard = false; // Stops player from clicking 3 cards at once
let matchedPairsCount = 0;

// Beginner Shuffling Algorithm (Loops through list and swaps positions randomly)
for (let i = cardIcons.length - 1; i > 0; i--) {
    let randomPos = Math.floor(Math.random() * (i + 1));
    let temporaryValue = cardIcons[i];
    cardIcons[i] = cardIcons[randomPos];
    cardIcons[randomPos] = temporaryValue;
}

// Generate the 16 card blocks dynamically on screen
for (let i = 0; i < cardIcons.length; i++) {
    // Create element box
    let newCard = document.createElement('div');
    newCard.className = 'card';
    newCard.innerText = cardIcons[i];
    // Attach index position to read later
    newCard.setAttribute('data-id', i);
    
    // Add click functionality to each card
    newCard.addEventListener('click', handleCardClick);
    
    // Append card to our grid layout
    gridContainer.appendChild(newCard);
}

// Click handling function
function handleCardClick() {
    // Start countdown timer on very first interaction
    if (gameStarted === false) {
        gameStarted = true;
        startCountdown();
    }

    // Guard checks to prevent incorrect double selection tricks
    if (lockBoard === true) return;
    if (this === firstCard) return;
    if (this.classList.contains('matched')) return;

    // Reveal card values
    this.classList.add('flipped');

    if (firstCard === null) {
        // Storing selection 1
        firstCard = this;
    } else {
        // Storing selection 2
        secondCard = this;
        lockBoard = true; // Block screen actions during match checks

        // Read character values to look for matching pairs
        if (firstCard.innerText === secondCard.innerText) {
            // MATCH FOUND!
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matchedPairsCount = matchedPairsCount + 1;
            
            // Clear current working variables
            firstCard = null;
            secondCard = null;
            lockBoard = false;

            // Check Win state
            if (matchedPairsCount === 8) {
                clearInterval(gameTimer);
                msgDisplay.innerText = "YOU WIN!";
                msgDisplay.style.color = "#00ffcc";
            }
        } else {
            // MISMATCH! Wait 0.8 seconds so user can see it, then hide it again
            msgDisplay.innerText = "TRY AGAIN";
            setTimeout(function() {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard = null;
                secondCard = null;
                lockBoard = false;
                msgDisplay.innerText = "FIND PAIRS";
            }, 800);
        }
    }
}

// Timer tick counter function
function startCountdown() {
    gameTimer = setInterval(function() {
        timeLeft = timeLeft - 1;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            lockBoard = true; // Turn off clicks
            msgDisplay.innerText = "GAME OVER!";
            msgDisplay.style.color = "#ff0066";
        }
    }, 1000);
}