const gameArea = document.getElementById('gameArea');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const gameOverText = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');

let ballSpeedX = 2;
let ballSpeedY = 2;
let ballX = gameArea.clientWidth / 2;
let ballY = 0;
let paddleX = gameArea.clientWidth / 2;
let gameOver = false;
let speedIncrementInterval = 5000; // Increase ball speed every 5 seconds

// Load sound
const paddleHitSound = new Audio('ball.mp3');

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
        paddleX = gameArea.clientWidth - paddle.clientWidth;
    }
    paddle.style.left = paddleX + 'px';
});

// Move the paddle with touch (for mobile)
gameArea.addEventListener('touchmove', (event) => {
    if (gameOver) return;

    // Get the touch position relative to the game area
    const touchX = event.touches[0].clientX - gameArea.offsetLeft;

    // Set the paddle's X position to the touch position
    paddleX = touchX - (paddle.clientWidth / 2);

    // Keep paddle within game area
    if (paddleX < 0) paddleX = 0;
    if (paddleX > gameArea.clientWidth - paddle.clientWidth) {
        paddleX = gameArea.clientWidth - paddle.clientWidth;
    }
    paddle.style.left = paddleX + 'px';
});

function moveBall() {
    if (gameOver) return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Improved collision detection: Check if ball hits the paddle
    if (ballY + ball.clientHeight >= gameArea.clientHeight - paddle.clientHeight) {
        if (ballX + ball.clientWidth >= paddleX && ballX <= paddleX + paddle.clientWidth) {
            ballSpeedY = -ballSpeedY; // Ball bounces off the paddle
            paddleHitSound.play(); // Play the hit sound
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

// Optional: Allow restarting the game with the spacebar
document.addEventListener('keydown', (event) => {
    if (gameOver && event.key === ' ') {
        restartGame();
    }
});

function restartGame() {
    // Reset game variables
    ballX = gameArea.clientWidth / 2;
    ballY = 0;
    paddleX = gameArea.clientWidth / 2;
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

// Function to gradually increase the ball speed
function increaseSpeed() {
    if (!gameOver) {
        ballSpeedX *= 1.1;
        ballSpeedY *= 1.1;
    }
}

// Start the game loop and gradually increase the ball speed every 5 seconds
gameLoop();
setInterval(increaseSpeed, speedIncrementInterval);
