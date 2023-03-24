class Enemy {
	constructor(game) {
		this.game = game;
		this.fps = 20;
		this.frameTimer = 0;
		this.frameInterval = 1000 / this.fps;
		this.frameX = 0;
		this.frameY = 0;
	}

	draw(context, deltaTime) {
		if (this.frameTimer >= this.frameInterval) {
			this.frameTimer = 0;
			++this.frameX;
			if (this.frameX > this.maxFrames) this.frameX = 0;
		}
		this.frameTimer += deltaTime;

		if (this.game.debug) {
			context.strokeRect(
				this.positionX,
				this.positionY,
				this.width,
				this.height
			);
		}

		context.drawImage(
			this.image,
			this.frameX * this.frameWidth,
			this.frameY * this.frameHeight,
			this.frameWidth,
			this.frameHeight,
			this.positionX,
			this.positionY,
			this.width,
			this.height
		);
	}

	update(deltaTime) {
		if (this.positionX < -this.width) this.markedForDeletion = true;

		this.positionX -= (this.velocityX + this.game.speed) * deltaTime;
		this.positionY += this.velocityY * deltaTime;
	}
}

export class FlyingEnemy extends Enemy {
	constructor(game) {
		super(game);
		this.image = enemyFly;
		this.width = 60;
		this.height = 44;
		this.frameWidth = this.width;
		this.frameHeight = this.height;
		this.positionX = this.game.width + Math.random() * this.game.width * 0.3;
		this.positionY = Math.random() * this.game.height * 0.3 + 0.2;
		this.velocityX = Math.random() / 10 + 0.05;
		this.velocityY = 0;
		this.maxFrames = 5;
		this.markedForDeletion = false;
		this.angle = 0;
		this.angleVelocity = Math.random() * 0.1 + 0.1;
		this.value = 1;
	}

	update(deltaTime) {
		super.update(deltaTime);
		this.angle += this.angleVelocity;
		this.positionY += Math.sin(this.angle);
	}
}

export class GroundEnemy extends Enemy {
	constructor(game) {
		super();
		this.game = game;
		this.image = enemyPlant;
		this.width = 60;
		this.height = 87;
		this.frameWidth = this.width;
		this.frameHeight = this.height;
		this.positionX = this.game.width;
		this.positionY = this.game.height - this.height - this.game.groundMargin;
		this.velocityX = 0;
		this.velocityY = 0;
		this.maxFrames = 1;
		this.markedForDeletion = false;
		this.fps = 7;
		this.frameInterval = 1000 / this.fps;
		this.value = 3;
	}
}

export class ClimbingEnemy extends Enemy {
	constructor(game) {
		super();
		this.game = game;
		this.image = enemySpiderBig;
		this.width = 120;
		this.height = 144;
		this.frameWidth = this.width;
		this.frameHeight = this.height;
		this.positionX = this.game.width;
		this.positionY = Math.random() * this.game.height * 0.5;
		this.velocityX = 0;
		this.velocityY = Math.random() > 0.5 ? 0.1 : -0.1;
		this.maxFrames = 5;
		this.markedForDeletion = false;
		this.value = 2;
	}

	update(deltaTime) {
		super.update(deltaTime);
		if (
			this.positionY >
			this.game.height - this.height - this.game.groundMargin
		)
			this.velocityY *= -1;
		if (this.positionY < -this.height) this.markedForDeletion = true;
	}

	draw(context, deltaTime) {
		super.draw(context, deltaTime);
		context.beginPath();
		context.moveTo(this.positionX + this.width / 2, 0);
		context.lineTo(
			this.positionX + this.width / 2,
			this.positionY + this.height * 0.3
		);
		context.stroke();
	}
}
