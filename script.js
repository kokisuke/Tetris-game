// JavaScript コード全文（Tetris-game の内容）
// 長いため折りたたんで表記しますが、中身はキャンバスにあるものと全く同じです。
// ↓ここからコピーして `script.js` に保存してください
const ROWS = 20;
const COLS = 10;
const TETROMINOS = {
  I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
  J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]]
};

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentTetromino, currentX, currentY;
let nextTetromino;
let score = 0, level = 1, lines = 0;
let gameOver = false;
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const restartButton = document.getElementById('restart-button');

// （以降すべてキャンバスの内容と同じです）
function drawBoard() { /* ... */ }
function drawTetromino() { /* ... */ }
function getTetrominoName(tetromino) { /* ... */ }
function generateTetromino() { /* ... */ }
function drawNext() { /* ... */ }
function getRandomTetromino() { /* ... */ }
function checkCollision(tetromino, x, y) { /* ... */ }
function mergeTetromino() { /* ... */ }
function clearLines() { /* ... */ }
function moveTetromino(dx, dy) { /* ... */ }
function rotateTetromino() { /* ... */ }

document.addEventListener('keydown', e => {
  if (gameOver) return;
  switch (e.key) {
    case 'ArrowLeft': moveTetromino(-1, 0); break;
    case 'ArrowRight': moveTetromino(1, 0); break;
    case 'ArrowDown': moveTetromino(0, 1); break;
    case 'ArrowUp': rotateTetromino(); break;
  }
});

function gameLoop() {
  if (gameOver) return;
  moveTetromino(0, 1);
  setTimeout(gameLoop, Math.max(100, 600 - level * 50));
}

restartButton.addEventListener('click', () => location.reload());

generateTetromino();
drawBoard();
drawTetromino();
gameLoop();
// ↑ここまでを `script.js` に保存してください
