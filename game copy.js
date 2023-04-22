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

var obstacle = {
    x: 400,
    y: 350,
    width: 100,
    height: 50
};

function drawPlayer() {
	ctx.fillStyle = player.color;
	ctx.fillRect(player.x, player.y, player.width, player.height);
}

function renderObstacle(ctx, obstacle) {
	ctx.fillStyle = 'red';
	ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
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

	// Check for collision with the obstacle
	if (checkCollision(obstacle)) {
		// Revert the player's position to the previous position
		player.x = playerPrevX;
		player.y = playerPrevY;
		
		// Stop the player's horizontal movement
		player.velocityX = 0;
	}

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
	renderObstacle(ctx, obstacle);

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

function checkCollision(obstacle) {
    // Calculate the player's bounding box
    var playerBox = {
        left: player.x,
        right: player.x + player.width,
        top: player.y,
        bottom: player.y + player.height
    };

    // Calculate the obstacle's bounding box
    var obstacleBox = {
        left: obstacle.x,
        right: obstacle.x + obstacle.width,
        top: obstacle.y,
        bottom: obstacle.y + obstacle.height
    };

    // Check for collision between the player and the obstacle
    if (playerBox.right > obstacleBox.left && playerBox.left < obstacleBox.right &&
        playerBox.bottom > obstacleBox.top && playerBox.top < obstacleBox.bottom) {
        // If the player is colliding from the bottom, set isOnGround to true
        if (playerBox.bottom > obstacleBox.top && player.velocityY >= 0) {
            player.isOnGround = true;
            player.velocityY = 0;
            player.y = obstacleBox.top - player.height;
        }

        // If the player is colliding from the top, reverse their vertical velocity
        if (playerBox.top < obstacleBox.bottom && player.velocityY < 0) {
            player.velocityY = -player.velocityY;
            player.y = obstacleBox.bottom;
        }

        // Stop the player's horizontal movement
        if (playerBox.right > obstacleBox.left && player.velocityX > 0) {
            player.velocityX = 0;
            player.x = obstacleBox.left - player.width;
        } else if (playerBox.left < obstacleBox.right && player.velocityX < 0) {
            player.velocityX = 0;
            player.x = obstacleBox.right;
        }

        return true;
    }

    return false;
}