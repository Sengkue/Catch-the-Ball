const gameArea = document.getElementById('gameArea');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const gameOverText = document.getElementById('gameOver');

let ballSpeedY = 2;
let ballX = gameArea.clientWidth / 2;
let ballY = 0;
let paddleX = gameArea.clientWidth / 2;
let gameOver = false;

// Move the paddle with arrow keys
document.addEventListener('keydown', (event) => {
    if (gameOver) return;
    
    const paddleSpeed = 20;
    if (event.key === 'ArrowLeft') {
        paddleX -= paddleSpeed;
    } else if (event.key === 'ArrowRight') {
        paddleX += paddleSpeed;
    }
    // Keep paddle within game area
    if (paddleX < 0) paddleX = 0;
    if (paddleX > gameArea.clientWidth - paddle.clientWidth) {
        paddleX = gameArea.clientWidth - paddle.clientWidth;
    }
    paddle.style.left = paddleX + 'px';
});

function moveBall() {
    if (gameOver) return;
    
    ballY += ballSpeedY;
    
    // Ball hits the paddle
    if (ballY >= gameArea.clientHeight - paddle.clientHeight - ball.clientHeight &&
        ballX >= paddleX && ballX <= paddleX + paddle.clientWidth) {
        ballSpeedY = -ballSpeedY; // Bounce off the paddle
    }
    
    // Ball hits the top
    if (ballY <= 0) {
        ballSpeedY = -ballSpeedY; // Bounce off top wall
    }
    
    // Game over if ball touches the bottom
    if (ballY >= gameArea.clientHeight - ball.clientHeight) {
        gameOver = true;
        gameOverText.style.display = 'block'; // Show Game Over text
    }
    
    ball.style.top = ballY + 'px';
    ball.style.left = ballX + 'px';
}

function gameLoop() {
    moveBall();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();
