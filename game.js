var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Add your game code here
var player = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    speed: 5,
    jumpSpeed: 15,
    maxFallSpeed: 20,
    velocityX: 0,
    velocityY: 0,
    accelerationX: 0,
    accelerationY: 1, // gravity
    isJumping: false,
    isOnGround: false,
    color: "blue"
};

var obstacles = [
    // Ground
    {
      x: 0,
      y: 450,
      width: 1000,
      height: 50,
      color: "green",
      type: "ground"
    },
    // Platforms
    {
      x: 100,
      y: 350,
      width: 200,
      height: 20,
      color: "red",
      type: "platform"
    },
    {
      x: 400,
      y: 250,
      width: 200,
      height: 20,
      color: "red",
      type: "platform"
    },
    {
      x: 700,
      y: 350,
      width: 200,
      height: 20,
      color: "red",
      type: "platform"
    },
    // Walls
    {
      x: 0,
      y: 0,
      width: 50,
      height: 500,
      color: "grey",
      type: "wall"
    },
    {
      x: 950,
      y: 0,
      width: 50,
      height: 500,
      color: "grey",
      type: "wall"
    },
  ];  

function drawPlayer() {
	ctx.fillStyle = player.color;
	ctx.fillRect(player.x, player.y, player.width, player.height);
}

function renderObstacles(ctx, obstacles) {
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        ctx.fillStyle = obstacle.color; // Set fillStyle to the obstacle's color
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

function gameLoop() {
	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Apply gravity to the player's velocity
	player.velocityY += player.accelerationY;

	// Save the player's current position before updating it
	var playerPrevX = player.x;
	var playerPrevY = player.y;

	// Update the player's position based on velocity
	player.x += player.velocityX;
	player.y += player.velocityY;

	// Check for collision with the ground
	if (player.y + player.height > canvas.height) {
		player.velocityY = 0;
		player.y = canvas.height - player.height;
		player.isOnGround = true;
	} else {
		player.isOnGround = false;
	}
  
    // Detect collisions
    detectCollisions();

	// Update the player's velocity based on user input
	if (keys["ArrowLeft"]) {
		player.velocityX = -player.speed;
	} else if (keys["ArrowRight"]) {
		player.velocityX = player.speed;
	} else {
		player.velocityX = 0;
	}

	// Update the player's velocity for jumping
	if (keys["ArrowUp"] && player.isOnGround) {
		player.velocityY = -player.jumpSpeed;
		player.isJumping = true;
	} else {
		player.isJumping = false;
	}

	// Draw the player character
	drawPlayer();
	renderObstacles(ctx, obstacles);

	// Request the next frame of the game loop
	requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);

var keys = {}; // object to store which keys are currently pressed

document.addEventListener("keydown", function(event) {
	keys[event.key] = true;
});

document.addEventListener("keyup", function(event) {
	delete keys[event.key];
});

// Collision detection function
function detectCollisions() {
    // Check for collisions with obstacles
    obstacles.forEach(obstacle => {
      if (player.x < obstacle.x + obstacle.width &&
          player.x + player.width > obstacle.x &&
          player.y < obstacle.y + obstacle.height &&
          player.y + player.height > obstacle.y) {
        // Collision detected with this obstacle
        handleCollision(obstacle);
      }
    });
  }
  
// Collision handling function
function handleCollision(obstacle) {
    // Calculate the amount of overlap between the player and the obstacle on each side
    const overlapLeft = player.x + player.width - obstacle.x;
    const overlapRight = obstacle.x + obstacle.width - player.x;
    const overlapTop = player.y + player.height - obstacle.y;
    const overlapBottom = obstacle.y + obstacle.height - player.y;
  
    // Determine which side the player collided with
    const maxOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
    if (maxOverlap === overlapLeft) {
      // Collided with obstacle from the left
      player.x = obstacle.x - player.width;
      player.velocityX = 0;
    } else if (maxOverlap === overlapRight) {
      // Collided with obstacle from the right
      player.x = obstacle.x + obstacle.width;
      player.velocityX = 0;
    } else if (maxOverlap === overlapTop) {
      // Collided with obstacle from the top
      player.y = obstacle.y - player.height;
      player.velocityY = 0;
      player.isOnGround = true;
    } else if (maxOverlap === overlapBottom) {
      // Collided with obstacle from the bottom
      player.y = obstacle.y + obstacle.height;
      player.velocityY = 0;
    }
}