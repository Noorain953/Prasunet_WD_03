const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const backButton = document.getElementById('back');
const restartButton = document.getElementById('restart');
const choiceMenu = document.getElementById('choice');
const gameBoard = document.getElementById('game-board');
const scoreboard = document.getElementById('scoreboard');
const playerScoreDisplay = document.getElementById('player-score');
const aiScoreDisplay = document.getElementById('ai-score');
const player1ScoreDisplay = document.getElementById('player1-score');
const player2ScoreDisplay = document.getElementById('player2-score');
let player1Score = 0;
let player2Score = 0;
let currentPlayer = 'X';
let gameActive = true;
let board = ['', '', '', '', '', '', '', '', ''];
let playerScore = 0;
let aiScore = 0;
let vsAI = false;

// Function to handle cell click
function handleCellClick(e) {
    const cellIndex = e.target.getAttribute('data-index');
    if (board[cellIndex] !== '' || !gameActive) return;

    board[cellIndex] = currentPlayer;
    e.target.textContent = currentPlayer;
    checkResult();

    if (vsAI && gameActive) {
        aiMove();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

// AI Move
function aiMove() {
    let availableCells = board.map((val, index) => (val === '' ? index : null)).filter(val => val !== null);
    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    board[randomIndex] = 'O';
    cells[randomIndex].textContent = 'O';
    checkResult();
    if (gameActive) {
        currentPlayer = 'X';
    }
}

// Check result
function checkResult() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    let roundWon = false;

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            condition.forEach(index => cells[index].classList.add('win'));
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        if (vsAI) {
            if (currentPlayer === 'X') {
                statusDisplay.textContent = 'Player Wins!';
                playerScore++;
            } else {
                statusDisplay.textContent = 'AI Wins!';
                aiScore++;
            }
        } else {
            statusDisplay.textContent = currentPlayer === 'X' ? 'Player 1 Wins!' : 'Player 2 Wins!';
            currentPlayer === 'X' ? player1Score++ : player2Score++;
        }
        updateScoreboard();
    } else if (!board.includes('')) {
        gameActive = false;
        statusDisplay.textContent = "It's a Draw!";
    }
}

// Update scoreboard
function updateScoreboard() {
    playerScoreDisplay.textContent = playerScore;
    aiScoreDisplay.textContent = aiScore;
    player1ScoreDisplay.textContent = player1Score || 0;
    player2ScoreDisplay.textContent = player2Score || 0;
}

// Restart game
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    statusDisplay.textContent = '';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win');
    });
}

// Set up opponent choice
document.getElementById('playAI').addEventListener('click', () => {
    vsAI = true;
    startGame();
});

document.getElementById('playOpponent').addEventListener('click', () => {
    vsAI = false;
    startGame();
});

function startGame() {
    choiceMenu.classList.add('hidden');
    gameBoard.classList.remove('hidden');
    statusDisplay.classList.remove('hidden');
    backButton.classList.remove('hidden');
    restartButton.classList.remove('hidden');
    scoreboard.classList.remove('hidden');

    if (vsAI) {
        document.getElementById('ai-scoreboard').classList.remove('hidden');
        document.getElementById('opponent-scoreboard').classList.add('hidden');
    } else {
        document.getElementById('ai-scoreboard').classList.add('hidden');
        document.getElementById('opponent-scoreboard').classList.remove('hidden');
    }

    restartGame();
}

// Back to choice menu
backButton.addEventListener('click', () => {
    gameBoard.classList.add('hidden');
    statusDisplay.classList.add('hidden');
    backButton.classList.add('hidden');
    restartButton.classList.add('hidden');
    scoreboard.classList.add('hidden');
    choiceMenu.classList.remove('hidden');
    restartGame();
});

// Restart button event listener
restartButton.addEventListener('click', restartGame);

// Cell click listener
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
