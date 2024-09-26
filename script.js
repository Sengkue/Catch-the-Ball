const gameArea = document.getElementById('gameArea');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const gameOverText = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');

let ballSpeedX = 2;
let ballSpeedY = 2;
let ballX = gameArea.clientWidth / 2;
let ballY = 0;
let paddleX = gameArea.clientWidth / 2 - paddle.clientWidth / 2; // Center paddle
let gameOver = false;

// Move the paddle with arrow keys (for desktop)
document.addEventListener('keydown', (event) => {
    if (gameOver) return;
    
    const paddleSpeed = 30; // You can adjust this speed
    if (event.key === 'ArrowLeft') {
        paddleX -= paddleSpeed;
    } else if (event.key === 'ArrowRight') {
        paddleX += paddleSpeed;
    }

    // Keep paddle within game area (left and right boundaries)
    if (paddleX < 0) {
        paddleX = 0;  // Prevent going past the left edge
    }
    if (paddleX > gameArea.clientWidth - paddle.clientWidth) {
        paddleX = gameArea.clientWidth - paddle.clientWidth;  // Prevent going past the right edge
    }

    paddle.style.left = paddleX + 'px';
});

// Move the paddle with touch (for mobile)
gameArea.addEventListener('touchmove', (event) => {
    if (gameOver) return;

    // Get the touch position relative to the game area
    const touchX = event.touches[0].clientX - gameArea.offsetLeft;
    
    // Set the paddle's X position based on touch, centered
    paddleX = touchX - paddle.clientWidth / 2;

    // Keep paddle within game area (left and right boundaries)
    if (paddleX < 0) {
        paddleX = 0;  // Prevent going past the left edge
    }
    if (paddleX > gameArea.clientWidth - paddle.clientWidth) {
        paddleX = gameArea.clientWidth - paddle.clientWidth;  // Prevent going past the right edge
    }

    paddle.style.left = paddleX + 'px';
});

function moveBall() {
    if (gameOver) return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Check if ball hits the paddle
    if (ballY + ball.clientHeight >= gameArea.clientHeight - paddle.clientHeight) {
        if (ballX + ball.clientWidth >= paddleX && ballX <= paddleX + paddle.clientWidth) {
            ballSpeedY = -ballSpeedY; // Ball bounces off the paddle
        } else if (ballY >= gameArea.clientHeight - ball.clientHeight) {
            gameOver = true;  // Game over if the ball misses the paddle
            gameOverText.style.display = 'block'; // Show Game Over text
            restartBtn.style.display = 'block';  // Show Restart button
        }
    }

    // Ball hits the left or right wall
    if (ballX <= 0 || ballX >= gameArea.clientWidth - ball.clientWidth) {
        ballSpeedX = -ballSpeedX; // Bounce off the side walls
    }

    // Ball hits the top
    if (ballY <= 0) {
        ballSpeedY = -ballSpeedY; // Bounce off top wall
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

// Restart the game when the user clicks the Restart button
restartBtn.addEventListener('click', restartGame);

function restartGame() {
    ballX = gameArea.clientWidth / 2 - ball.clientWidth / 2; // Center the ball
    ballY = 0;
    paddleX = gameArea.clientWidth / 2 - paddle.clientWidth / 2; // Center the paddle
    ballSpeedX = 2;
    ballSpeedY = 2;
    gameOver = false;

    // Hide the Game Over text and Restart button
    gameOverText.style.display = 'none';
    restartBtn.style.display = 'none';

    // Reset positions
    ball.style.top = ballY + 'px';
    ball.style.left = ballX + 'px';
    paddle.style.left = paddleX + 'px';

    // Start the game loop again
    gameLoop();
}

// Start the game loop
gameLoop();
