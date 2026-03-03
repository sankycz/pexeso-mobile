const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
const gameSymbols = [...symbols, ...symbols];

let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timerSeconds = 0;
let timerInterval = null;

const splashScreen = document.getElementById('splash-screen');
const mainMenu = document.getElementById('main-menu');
const gameBoard = document.getElementById('game-board');
const victoryScreen = document.getElementById('victory-screen');
const grid = document.getElementById('grid');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');

// Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Initialization
window.addEventListener('load', () => {
    setTimeout(() => {
        showScreen('main-menu');
    }, 2000);
});

document.getElementById('play-button').addEventListener('click', () => {
    startGame();
    showScreen('game-board');
});

document.getElementById('restart-button').addEventListener('click', () => {
    startGame();
    showScreen('game-board');
});

document.getElementById('home-button').addEventListener('click', () => {
    showScreen('main-menu');
});

// Game Logic
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame() {
    grid.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    timerSeconds = 0;
    movesDisplay.textContent = '0';
    timerDisplay.textContent = '00:00';
    
    clearInterval(timerInterval);
    startTimer();

    const shuffled = shuffle([...gameSymbols]);
    shuffled.forEach((symbol, index) => {
        const card = createCard(symbol, index);
        grid.appendChild(card);
    });
}

function createCard(symbol, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.dataset.index = index;

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-back"></div>
            <div class="card-front">${symbol}</div>
        </div>
    `;

    card.addEventListener('click', () => flipCard(card));
    return card;
}

function flipCard(card) {
    if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.symbol === card2.dataset.symbol;

    if (isMatch) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        flippedCards = [];
        
        if (matchedPairs === symbols.length) {
            endGame();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timerSeconds++;
        const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
        const seconds = (timerSeconds % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    document.getElementById('final-time').textContent = timerDisplay.textContent;
    document.getElementById('final-moves').textContent = moves;
    setTimeout(() => {
        showScreen('victory-screen');
    }, 500);
}
