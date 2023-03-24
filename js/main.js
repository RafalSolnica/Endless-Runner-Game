import Player from "./player.js";
import InputHandler from "./input.js";
import Background from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemies.js";
import { UI } from "./UI.js";

window.addEventListener("load", () => {
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	canvas.width = 900;
	canvas.height = 500;

	class Game {
		constructor(width, height) {
			this.width = width;
			this.height = height;
			this.groundMargin = 40;
			this.groundLevel = this.height - this.groundMargin;
			this.speed = 0;
			this.maxSpeed = 0.3;
			this.background = new Background(this);
			this.input = new InputHandler(
				this,
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight",
				" "
			);
			this.player = new Player(this, this.input);
			this.UI = new UI(this);
			this.enemies = [];
			this.particles = [];
			this.collisions = [];
			this.floatingMessages = [];
			this.enemyTImer = 0;
			this.enemyInterval = 700;
			this.debug = false;
			this.fontColor = "black";
			this.maxParticleCount = 200;
			this.gameOver = false;
			this.score = 0;
			this.winningScore = 50;
			this.hitPenalty = 5;
			this.time = 0;
			this.maxTime = 30000;
			this.livesLeft = 5;
			this.player.currentState = this.player.states[0];
			this.player.currentState.enter();
		}

		update(deltaTime) {
			// handling basic game mechanics
			this.time += deltaTime;
			if (this.time > this.maxTime) this.gameOver = true;
			this.background.update(deltaTime);
			this.player.update(deltaTime);
			// handle enemies
			this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
			this.enemies.forEach((enemy) => enemy.update(deltaTime));
			// handle particles
			this.particles = this.particles.filter(
				(particle) => !particle.markedForDeletion
			);
			this.particles.forEach((particle) => particle.update());
			// handle collsions
			this.collisions = this.collisions.filter(
				(collision) => !collision.markedForDeletion
			);
			this.collisions.forEach((collision) => collision.update(deltaTime));
			// handle floating messages
			this.floatingMessages = this.floatingMessages.filter(
				(message) => !message.markedForDeletion
			);
			this.floatingMessages.forEach((message) => message.update(deltaTime));
			// spawning enemies
			if (this.enemyTImer > this.enemyInterval) {
				this.addEnemy();
				this.enemyTImer = 0;
			}
			this.enemyTImer += deltaTime;
			// deleting particles if there are too many of them
			if (this.particles.length > this.maxParticleCount)
				this.particles = this.particles.slice(0, this.maxParticleCount);
		}

		draw(deltaTime) {
			this.background.draw(ctx);
			this.player.draw(ctx, deltaTime);
			this.particles.forEach((particle) => particle.draw(ctx));
			this.enemies.forEach((enemy) => enemy.draw(ctx, deltaTime));
			this.collisions.forEach((collision) => collision.draw(ctx));
			this.floatingMessages.forEach((message) => message.draw(ctx));
			this.UI.draw(ctx);
		}

		addEnemy() {
			this.enemies.push(new FlyingEnemy(this));
			const randomEnemy = Math.random();
			if (this.speed > 0 && randomEnemy < 0.5)
				this.enemies.push(new GroundEnemy(this));
			if (this.speed > 0 && randomEnemy >= 0.5)
				this.enemies.push(new ClimbingEnemy(this));
		}
	}

	const game = new Game(canvas.width, canvas.height);
	let lastTime = 0;

	function animate(timestamp = 0) {
		const deltaTime = timestamp - lastTime;
		lastTime = timestamp;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.update(deltaTime);
		game.draw(deltaTime);
		if (!game.gameOver) requestAnimationFrame(animate);
	}

	animate();
});
