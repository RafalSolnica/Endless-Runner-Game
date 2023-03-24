class Particle {
	constructor(game, positionX, positionY) {
		this.game = game;
		this.positionX = positionX;
		this.positionY = positionY;
		this.markedForDeletion = false;
	}

	update() {
		this.positionX -= this.velocityX + this.game.speed;
		this.positionY -= this.velocityY;
		this.size *= 0.97;
		if (this.size < 0.5) this.markedForDeletion = true;
	}
}

export class Dust extends Particle {
	constructor(game, x, y) {
		super(game, x, y);
		this.size = Math.random() * 10 + 7;
		this.velocityX = Math.random();
		this.velocityY = Math.random();
		this.color = "#444";
	}

	draw(context) {
		context.beginPath();
		context.arc(this.positionX, this.positionY, this.size, 0, Math.PI * 2);
		context.fillStyle = this.color;
		context.fill();
	}
}

export class Fire extends Particle {
	constructor(game, x, y) {
		super(game, x, y);
		this.image = fireImage;
		this.size = Math.random() * 50 + 50;
		this.velocityX = 1;
		this.velocityY = 1;
		this.angle = 0;
		this.angleVelocity = Math.random() * 0.2 - 0.1;
	}

	update() {
		super.update();
		this.angle += this.angleVelocity;
		this.positionX += Math.sin(this.angle * 10);
	}

	draw(context) {
		context.save();
		context.translate(this.positionX, this.positionY);
		context.rotate(this.angle);
		context.drawImage(
			this.image,
			-this.size * 0.5,
			-this.size * 0.5,
			this.size,
			this.size
		);
		context.restore();
	}
}

export class Splash extends Particle {
	constructor(game, x, y) {
		super(game, x, y);
		this.image = fireImage;
		this.size = Math.random() * 100 + 100;
		this.velocityX = Math.random() * 6 - 3;
		this.velocityY = Math.random() * 2 + 2;
		this.gravity = 0;
	}

	update() {
		super.update();
		this.gravity += 0.07;
		this.positionY += this.gravity;
	}

	draw(context) {
		context.drawImage(
			this.image,
			this.positionX - this.size * 0.5,
			this.positionY - this.size * 0.1,
			this.size,
			this.size
		);
	}
}

export class CollisionParticle extends Particle {
	constructor(game, x, y) {
		super(game, x, y);
		this.image = boomImage;
		this.spriteWidth = 100;
		this.spriteHeight = 90;
		this.sizeModifier = Math.random() + 0.5;
		this.width = this.spriteWidth * this.sizeModifier;
		this.height = this.spriteHeight * this.sizeModifier;
		this.positionX = this.positionX - this.width * 0.5;
		this.positionY = this.positionY - this.height * 0.5;
		this.frameX = 0;
		this.maxFrame = 4;
		this.fps = 10;
		this.frameTimer = 0;
		this.frameInterval = 1000 / this.fps;
	}

	update(deltaTime) {
		if (this.frameTimer >= this.frameInterval) {
			this.frameTimer = 0;
			++this.frameX;
			if (this.frameX > this.maxFrames) this.frameX = 0;
		}
		this.frameTimer += deltaTime;

		this.positionX -= this.game.speed;
	}

	draw(context) {
		context.drawImage(
			this.image,
			this.frameX * this.spriteWidth,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.positionX,
			this.positionY,
			this.width,
			this.height
		);
	}
}
