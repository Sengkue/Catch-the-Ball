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

// Load sounds
const paddleHitSound = new Audio('ball.mp3');
const gameOverSound = new Audio('game-over.mp3');
const gameStartSound = new Audio('game-start.mp3');
const hitCornerSound = new Audio('hit-corner.mp3'); // Load hit corner sound

// Function to start the game
function startGame() {
    gameStartSound.play(); // Play the start sound
    gameLoop();
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
        paddleX = gameArea.clientWidth - paddle.clientWidth;
    }
    paddle.style.left = paddleX + 'px';
});

// Move the paddle with touch (for mobile)
gameArea.addEventListener('touchmove', (event) => {
    if (gameOver) return;

    const touchX = event.touches[0].clientX - gameArea.offsetLeft;
    paddleX = touchX - (paddle.clientWidth / 2);
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
            gameOverSound.play(); // Play the game over sound
            gameOverText.style.display = 'block'; // Show Game Over text
            restartBtn.style.display = 'block';  // Show Restart button
        }
    }

    // Ball hits the left or right wall
    if (ballX <= 0 || ballX >= gameArea.clientWidth - ball.clientWidth) {
        ballSpeedX = -ballSpeedX; // Bounce off the side walls
        hitCornerSound.play(); // Play hit corner sound on side wall hit
        console.log("Hit side wall"); // Debugging statement
    }
    
    // Ball hits the top
    if (ballY <= 0) {
        ballSpeedY = -ballSpeedY; // Bounce off top wall
        hitCornerSound.play(); // Play hit corner sound on top wall hit
        console.log("Hit top wall"); // Debugging statement
    }

    // Check if the ball hits the corners specifically
    if (
        (ballX <= 0 && ballY <= 0) || // Top left corner
        (ballX <= 0 && ballY >= gameArea.clientHeight - ball.clientHeight) || // Bottom left corner
        (ballX >= gameArea.clientWidth - ball.clientWidth && ballY <= 0) || // Top right corner
        (ballX >= gameArea.clientWidth - ball.clientWidth && ballY >= gameArea.clientHeight - ball.clientHeight) // Bottom right corner
    ) {
        hitCornerSound.play(); // Play hit corner sound
        console.log("Hit corner"); // Debugging statement
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

    // Play the start sound when the game restarts
    gameStartSound.currentTime = 0; // Reset playback position to the start
    gameStartSound.play(); // Play the start sound

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
startGame(); // Start the game and play the start sound
setInterval(increaseSpeed, speedIncrementInterval);
