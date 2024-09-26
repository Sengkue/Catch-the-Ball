let paddle, ball, gameArea;
let paddleX;
let ballX, ballY;
let ballSpeedX = 2;
let ballSpeedY = 2;
let gameOver = false;
let interval;

document.addEventListener('DOMContentLoaded', () => {
    paddle = document.getElementById('paddle');
    ball = document.getElementById('ball');
    gameArea = document.getElementById('gameArea');
    paddleX = gameArea.clientWidth / 2 - paddle.clientWidth / 2;
    ballX = gameArea.clientWidth / 2 - ball.clientWidth / 2;
    ballY = 50; // Initial ball Y position
    startGame();
});

// Start the game
function startGame() {
    gameOver = false;
    ballSpeedX = 2; // Reset ball speed
    ballSpeedY = 2; // Reset ball speed
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('restartBtn').style.display = 'none';

    interval = setInterval(() => {
        moveBall();
    }, 20);

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
}

// Move the ball
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Check for collision with walls
    if (ballX + ball.clientWidth > gameArea.clientWidth || ballX < 0) {
        ballSpeedX = -ballSpeedX; // Reverse direction on X axis
    }

    // Check for collision with the paddle
    if (
        ballY + ball.clientHeight >= gameArea.clientHeight - paddle.clientHeight &&
        ballX + ball.clientWidth > paddleX &&
        ballX < paddleX + paddle.clientWidth
    ) {
        ballSpeedY = -ballSpeedY; // Reverse direction on Y axis
    }

    // Check if the ball falls below the game area
    if (ballY + ball.clientHeight > gameArea.clientHeight) {
        endGame();
    }

    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';

    // Increase ball speed over time
    ballSpeedX += (ballSpeedX > 0 ? 0.001 : -0.001); // Gradually increase speed on X axis
    ballSpeedY += (ballSpeedY > 0 ? 0.001 : -0.001); // Gradually increase speed on Y axis
}

// End the game
function endGame() {
    clearInterval(interval);
    gameOver = true;
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('restartBtn').style.display = 'block';
}

// Restart the game
function restartGame() {
    ballX = gameArea.clientWidth / 2 - ball.clientWidth / 2;
    ballY = 50; // Reset ball Y position
    paddleX = gameArea.clientWidth / 2 - paddle.clientWidth / 2;
    paddle.style.left = paddleX + 'px';
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
    startGame();
}
