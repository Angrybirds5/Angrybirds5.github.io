// Create the canvas element
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
canvas.tabIndex = 1; // Added tabindex attribute
document.body.appendChild(canvas);

// Update the canvas size
function resizeCanvas() {
  const borderWidth = 10; // Border width in pixels
  const windowHeight = window.innerHeight - borderWidth;
  const windowWidth = window.innerWidth;

  canvas.width = windowWidth;
  canvas.height = windowHeight;
}

// Initialize game variables
let ballX;
let ballY;
let ballSpeedX = 4; // Updated speed
let ballSpeedY = 4; // Updated speed
let paddleWidth = 150; // Initial bar width
const paddleHeight = 15; // Initial bar height
let paddleY;
let paddleX;
let leftArrowPressed = false;
let rightArrowPressed = false;
let score = 0;
let highScore = 0;
let gamePaused = false;

// Initialize game
function init() {
  resizeCanvas();
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  paddleY = canvas.height - paddleHeight - 10;
  paddleX = (canvas.width - paddleWidth) / 2;
}

// Update the game state
function update() {
  // Pause the game when Spacebar is pressed
  document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      gamePaused = !gamePaused;
    }
  });

  if (gamePaused) {
    return;
  }

  // Move the paddle
  movePaddle();

  // Move the ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Handle collision with the paddle
  if (
    ballX > paddleX &&
    ballX < paddleX + paddleWidth &&
    ballY + 10 > paddleY
  ) {
    ballSpeedY = -ballSpeedY;
    score++;
    if (score % 10 === 0) {
      paddleWidth *= 0.9; // Decrease bar width by 10% each time score is a multiple of 10
    }
  }

  // Handle collision with walls
  if (ballX > canvas.width || ballX < 0) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY > canvas.height || ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    // Reset the ball position and score
    ballX = Math.random() * (canvas.width - 20) + 10; // Random x position between 10 and canvas.width-10
    ballY = canvas.height / 2;
    if (score > highScore) {
      highScore = score; // Update the high score
    }
    score = 0;
    paddleWidth = 150; // Reset bar width
  }

  // Render the game
  draw();
}

// Move the paddle based on arrow key input
function movePaddle() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      leftArrowPressed = true;
    } else if (event.key === "ArrowRight") {
      rightArrowPressed = true;
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") {
      leftArrowPressed = false;
    } else if (event.key === "ArrowRight") {
      rightArrowPressed = false;
    }
  });

  if (leftArrowPressed && paddleX > 0) {
    paddleX -= 5;
  } else if (rightArrowPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 5;
  }
}

// Render the game on the canvas
function draw() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the paddle
  context.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);

  // Draw the ball
  context.beginPath();
  context.arc(ballX, ballY, 10, 0, Math.PI * 2);
  context.fill();
  context.closePath();

  // Draw the score
  context.font = "20px Arial";
  context.fillText("Score: " + score, 10, 30);

  // Draw the high score
  context.font = "20px Arial";
  context.fillText("High Score: " + highScore, 10, 60);

  // Draw the pause message
  if (gamePaused) {
    context.font = "30px Arial";
    context.fillText("Game Paused", canvas.width / 2 - 100, canvas.height / 2);
  }
}

// Start the game loop
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

// Resize the canvas when the window is resized
window.addEventListener("resize", resizeCanvas);

// Start the game
init();
gameLoop();
