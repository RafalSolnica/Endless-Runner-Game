import {
	Standing,
	Jumping,
	Falling,
	Running,
	Sitting,
	Rolling,
	Diving,
	Dizzy,
} from "./playerStates.js";
import { CollisionParticle } from "./particles.js";
import { FloatingMessage } from "./floatingMessages.js";

export default class Player {
	constructor(game, input) {
		this.game = game;
		this.input = input;
		this.image = playerImage;
		this.width = 100.4;
		this.height = 91.3;
		this.positionX = 0;
		this.positionY = this.game.groundLevel - this.height;
		this.frameWidth = this.width;
		this.frameHeight = this.height;
		this.maxFrames = 6;
		this.fps = 20;
		this.frameTimer = 0;
		this.frameInterval = 1000 / this.fps;
		this.frameX = 0;
		this.frameY = 0;
		this.velocityX = 0;
		this.velocityY = 0;
		this.maxVelocityX = 0.6;
		this.accelerationX = 0.03;
		this.maxVelocityY = 1.3;
		this.weight = 0.02;
		this.states = [
			new Standing(this.game),
			new Jumping(this.game),
			new Falling(this.game),
			new Running(this.game),
			new Sitting(this.game),
			new Rolling(this.game),
			new Diving(this.game),
			new Dizzy(this.game),
		];
		this.currentState = null;
		this.particleTimer = 0;
		this.particleInterval = 1000 / 120;
		this.maxFallingSpeed = 1.3;
	}

	update(deltaTime) {
		this.currentState.handleInput(this.input);
		this.checkForCollision();

		// Movement
		this.positionX += this.velocityX * deltaTime;
		this.positionY += this.velocityY * deltaTime;

		// Horizontal boundaries
		if (this.positionX > this.game.width) this.positionX = -this.width;
		if (this.positionX < -this.width) this.positionX = this.game.width;

		// moving to the right
		if (
			this.input.pressed.includes(this.input.keys.right) &&
			this.input.lastPressedX != this.input.keys.left
		) {
			this.velocityX = this.increaseUpTo(
				this.velocityX,
				this.maxVelocityX,
				this.accelerationX
			);
		}

		// moving to the left
		if (
			this.input.pressed.includes(this.input.keys.left) &&
			this.input.lastPressedX != this.input.keys.right
		) {
			this.velocityX = this.decreaseUpTo(
				this.velocityX,
				-this.maxVelocityX,
				this.accelerationX
			);
		}

		// slowing down after releasing horizontal keys
		if (this.velocityX > 0 && this.input.lastPressedX === "") {
			this.velocityX = this.decreaseUpTo(
				this.velocityX,
				0,
				this.accelerationX / 2
			);
		}

		if (this.velocityX < 0 && this.input.lastPressedX === "") {
			this.velocityX = this.increaseUpTo(
				this.velocityX,
				0,
				this.accelerationX / 2
			);
		}

		// stopping after pressing down key
		if (this.input.lastPressedY === this.input.keys.down && this.onGround()) {
			this.velocityX = 0;
		}

		// stopping after getting hit by enemy
		if (this.currentState === this.states[7]) this.velocityX = 0;

		// Vertical movement
		if (this.onGround()) this.velocityY = 0;

		// falling down
		if (
			!this.onGround() &&
			this.positionY + this.height + this.velocityY < this.game.groundLevel
		)
			this.velocityY += this.weight;

		// jumping
		if (
			this.input.pressed.includes(this.input.keys.up) &&
			this.input.lastPressedY != this.input.keys.down &&
			this.onGround() &&
			this.currentState !== this.states[7]
		) {
			this.velocityY = -this.maxVelocityY;
		}

		// falling meteor strike
		if (
			!this.onGround() &&
			this.input.pressed.includes(this.input.keys.down) &&
			this.currentState !== this.states[7]
		) {
			this.velocityX = 0;
			this.velocityY = this.maxVelocityY * this.maxFallingSpeed;
		}

		// Vertical boundaries
		if (
			!this.onGround() &&
			this.positionY + this.height + this.velocityY * deltaTime >=
				this.game.groundLevel
		) {
			this.positionY = this.game.groundLevel - this.height;
			this.velocityY = 0;
		}
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

	onGround() {
		return this.positionY + this.height >= this.game.groundLevel;
	}

	increaseUpTo(value1, value2, increase) {
		return value1 + increase > value2 ? value2 : value1 + increase;
	}

	decreaseUpTo(value1, value2, decrease) {
		return value1 - decrease < value2 ? value2 : value1 - decrease;
	}

	setState(state, speed) {
		this.currentState = this.states[state];
		this.game.speed = this.game.maxSpeed * speed;
		this.currentState.enter();
	}

	checkForCollision() {
		this.game.enemies.forEach((enemy) => {
			if (
				enemy.positionY + enemy.height >= this.positionY &&
				enemy.positionY <= this.positionY + this.height &&
				enemy.positionX <= this.positionX + this.width &&
				enemy.positionX + enemy.width >= this.positionX
			) {
				enemy.markedForDeletion = true;
				this.game.collisions.push(
					new CollisionParticle(
						this.game,
						enemy.positionX + enemy.width * 0.5,
						enemy.positionY + enemy.height * 0.5
					)
				);
				if (this.currentState === this.states[7]) return;
				if (
					this.currentState === this.states[5] ||
					this.currentState === this.states[6]
				) {
					this.game.score += enemy.value;
					this.game.floatingMessages.push(
						new FloatingMessage(
							`+${enemy.value}`,
							enemy.positionX,
							enemy.positionY,
							150,
							46
						)
					);
					return;
				}
				this.setState(7, 0);
				--this.game.livesLeft;
				this.game.score -= this.game.hitPenalty;
				if (this.game.livesLeft === 0) this.game.gameOver = true;
			}
		});
	}
}
