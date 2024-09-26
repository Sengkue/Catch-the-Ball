const gameArea = document.getElementById('gameArea');
const ball = document.getElementById('ball');
const paddle = document.getElementById('paddle');
const gameOverText = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');

let ballX = gameArea.clientWidth / 2;
let ballY = gameArea.clientHeight / 2;
let ballSpeedX = 2;
let ballSpeedY = 2;
let paddleX = gameArea.clientWidth / 2 - paddle.clientWidth / 2;
let gameOver = false;
let score = 0;

// Start the game
function startGame() {
    ballX = gameArea.clientWidth / 2;
    ballY = gameArea.clientHeight / 2;
    ballSpeedX = 2;
    ballSpeedY = 2;
    paddleX = gameArea.clientWidth / 2 - paddle.clientWidth / 2;
    score = 0;
    gameOver = false;
    gameOverText.style.display = 'none';
    restartBtn.style.display = 'none';
    
    requestAnimationFrame(gameLoop);
}

// Game loop
function gameLoop() {
    if (gameOver) return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce off walls
    if (ballX <= 0 || ballX >= gameArea.clientWidth - ball.clientWidth) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballY <= 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Check for paddle collision
    if (ballY + ball.clientHeight >= gameArea.clientHeight - paddle.clientHeight &&
        ballX + ball.clientWidth >= paddleX &&
        ballX <= paddleX + paddle.clientWidth) {
        ballSpeedY = -ballSpeedY;
        score++; // Increase score
        // Increase speed over time
        if (score % 5 === 0) { // Increase speed every 5 points
            ballSpeedX *= 1.1; // Increase horizontal speed
            ballSpeedY *= 1.1; // Increase vertical speed
        }
    }

    // Check for game over
    if (ballY > gameArea.clientHeight) {
        gameOver = true;
        gameOverText.style.display = 'block';
        restartBtn.style.display = 'block';
    }

    // Update ball position
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';

    requestAnimationFrame(gameLoop);
}

// Move the paddle with arrow keys (for desktop)
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
        paddleX = gameArea.clientWidth - paddle.clientWidth; // Prevents paddle from moving off the right edge
    }
    paddle.style.left = paddleX + 'px';
});

// Move the paddle with touch (for mobile)
gameArea.addEventListener('touchmove', (event) => {
    if (gameOver) return;
    
    // Get the touch position relative to the game area
    const touchX = event.touches[0].clientX - gameArea.offsetLeft;

    // Set the paddle's X position to the touch position
    paddleX = touchX - (paddle.clientWidth / 2); // Center the paddle on the touch position

    // Keep paddle within game area
    if (paddleX < 0) paddleX = 0;
    if (paddleX > gameArea.clientWidth - paddle.clientWidth) {
        paddleX = gameArea.clientWidth - paddle.clientWidth; // Prevents paddle from moving off the right edge
    }
    paddle.style.left = paddleX + 'px';
});

// Restart the game
restartBtn.addEventListener('click', startGame);

// Start the game when the page loads
window.onload = startGame;
