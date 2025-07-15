const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 20;

const board = [];
for (let row = 0; row < ROWS; row++) {
    board.push(Array(COLS).fill(0));
}

const TETROMINOS = {
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'O': [
        [1, 1],
        [1, 1]
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
};

const COLORS = {
    'I': 'cyan',
    'J': 'blue',
    'L': 'orange',
    'O': 'yellow',
    'S': 'green',
    'T': 'purple',
    'Z': 'red'
};

let currentTetromino = null;
let currentX = 0;
let currentY = 0;
let score = 0;
let gameOver = false;

const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');

function drawBoard() {
    gameBoard.innerHTML = '';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.classList.add('tetromino');
            if (board[row][col] !== 0) {
                cell.style.backgroundColor = COLORS[board[row][col]];
            }
            gameBoard.appendChild(cell);
        }
    }
}

function generateTetromino() {
    const tetrominoTypes = Object.keys(TETROMINOS);
    const randomType = tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)];
    currentTetromino = TETROMINOS[randomType];
    currentX = Math.floor(COLS / 2) - Math.floor(currentTetromino[0].length / 2);
    currentY = 0;

    if (checkCollision(currentTetromino, currentX, currentY)) {
        gameOver = true;
        gameOverDisplay.classList.remove('hidden');
    }
}

function drawTetromino() {
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col] !== 0) {
                const boardX = currentX + col;
                const boardY = currentY + row;
                if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                    const cellIndex = boardY * COLS + boardX;
                    const cell = gameBoard.children[cellIndex];
                    cell.style.backgroundColor = COLORS[Object.keys(TETROMINOS).find(key => TETROMINOS[key] === currentTetromino)];
                }
            }
        }
    }
}

function checkCollision(tetromino, x, y) {
    for (let row = 0; row < tetromino.length; row++) {
        for (let col = 0; col < tetromino[row].length; col++) {
            if (tetromino[row][col] !== 0) {
                const boardX = x + col;
                const boardY = y + row;

                if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
                    return true; // 壁または床との衝突
                }
                if (boardY < 0) {
                    continue; // ゲームボードの上端より上は無視
                }
                if (board[boardY][boardX] !== 0) {
                    return true; // 他のブロックとの衝突
                }
            }
        }
    }
    return false;
}

function mergeTetromino() {
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col] !== 0) {
                const boardX = currentX + col;
                const boardY = currentY + row;
                if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                    board[boardY][boardX] = Object.keys(TETROMINOS).find(key => TETROMINOS[key] === currentTetromino);
                }
            }
        }
    }
}

function clearLines() {
    let linesCleared = 0;
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
            row++; // 行を削除したので、同じ行を再度チェック
        }
    }
    if (linesCleared > 0) {
        score += linesCleared * 100; // スコア加算
        scoreDisplay.textContent = score;
    }
}

function moveTetromino(dx, dy) {
    if (gameOver) return;

    if (!checkCollision(currentTetromino, currentX + dx, currentY + dy)) {
        currentX += dx;
        currentY += dy;
    } else if (dy > 0) { // 下に移動して衝突した場合
        mergeTetromino();
        clearLines();
        generateTetromino();
    }
    drawBoard();
    drawTetromino();
}

function rotateTetromino() {
    if (gameOver) return;

    const originalTetromino = currentTetromino;
    const rotatedTetromino = [];
    for (let i = 0; i < originalTetromino[0].length; i++) {
        rotatedTetromino.push([]);
        for (let j = originalTetromino.length - 1; j >= 0; j--) {
            rotatedTetromino[i].push(originalTetromino[j][i]);
        }
    }

    if (!checkCollision(rotatedTetromino, currentX, currentY)) {
        currentTetromino = rotatedTetromino;
    }
    drawBoard();
    drawTetromino();
}

document.addEventListener('keydown', e => {
    if (gameOver) return;

    switch (e.key) {
        case 'ArrowLeft':
            moveTetromino(-1, 0);
            break;
        case 'ArrowRight':
            moveTetromino(1, 0);
            break;
        case 'ArrowDown':
            moveTetromino(0, 1);
            break;
        case 'ArrowUp':
            rotateTetromino();
            break;
    }
});

function gameLoop() {
    if (gameOver) return;

    moveTetromino(0, 1); // 自動落下
    setTimeout(gameLoop, 500); // 500msごとに落下
}

restartButton.addEventListener('click', () => {
    location.reload(); // ページをリロードしてゲームを再開
});

// Initial setup
generateTetromino();
drawBoard();
drawTetromino();
gameLoop();
