import { Dust, Splash, Fire } from "./particles.js";

export const states = {
	STANDING: 0,
	JUMPING: 1,
	FALLING: 2,
	RUNNING: 3,
	SITTING: 4,
	ROLLING: 5,
	DIVING: 6,
	DIZZY: 7,
};

class State {
	constructor(state) {
		this.state = state;
	}

	createDustParticles() {
		this.game.particles.unshift(
			new Dust(
				this.game,
				this.game.player.positionX + this.game.player.width * 0.5,
				this.game.player.positionY + this.game.player.height
			)
		);
	}

	createFireParticles() {
		this.game.particles.unshift(
			new Fire(
				this.game,
				this.game.player.positionX + this.game.player.width * 0.5,
				this.game.player.positionY + this.game.player.height * 0.5
			)
		);
	}

	createSplashParticles() {
		const splashParticleCount = 50;
		for (let i = 0; i < splashParticleCount; i++) {
			this.game.particles.unshift(
				new Splash(
					this.game,
					this.game.player.positionX + this.game.player.width * 0.5,
					this.game.player.positionY + this.game.player.height * 0.5
				)
			);
		}
	}
}

export class Standing extends State {
	constructor(game) {
		super("STANDING");
		this.game = game;
	}

	enter() {
		this.game.player.frameX = 0;
		this.game.player.frameY = 0;
		this.game.player.maxFrames = 6;
	}

	handleInput(input) {
		if (
			input.pressed.includes(input.keys.left) ||
			input.pressed.includes(input.keys.right)
		)
			this.game.player.setState(states.RUNNING, 1);

		if (
			input.lastPressedY === input.keys.up &&
			this.game.player.velocityX !== 0
		)
			this.game.player.setState(states.JUMPING, 1);

		if (
			input.lastPressedY === input.keys.up &&
			this.game.player.velocityX === 0
		)
			this.game.player.setState(states.JUMPING, 0);

		if (input.lastPressedY === input.keys.down)
			this.game.player.setState(states.SITTING, 0);

		if (input.pressed.includes(input.keys.roll))
			this.game.player.setState(states.ROLLING, 2);
	}
}

export class Jumping extends State {
	constructor(game) {
		super("JUMPING");
		this.game = game;
	}

	enter() {
		this.game.player.frameX = 0;
		this.game.player.frameY = 1;
		this.game.player.maxFrames = 6;
	}

	handleInput(input) {
		if (this.game.player.velocityX === 0)
			this.game.speed = this.game.maxSpeed * 0;
		if (this.game.player.velocityX !== 0)
			this.game.speed = this.game.maxSpeed * 1;
		if (this.game.player.velocityY > 0 && this.game.player.velocityX !== 0)
			this.game.player.setState(states.FALLING, 1);

		if (this.game.player.velocityY > 0 && this.game.player.velocityX === 0)
			this.game.player.setState(states.FALLING, 0);

		if (input.pressed.includes(input.keys.roll))
			this.game.player.setState(states.ROLLING, 2);

		if (input.pressed.includes(input.keys.down))
			this.game.player.setState(states.DIVING, 0);
	}
}

export class Falling extends State {
	constructor(game) {
		super("FALLING");
		this.game = game;
	}

	enter() {
		this.game.player.frameX = 0;
		this.game.player.frameY = 2;
		this.game.player.maxFrames = 6;
	}

	handleInput(input) {
		if (this.game.player.velocityX === 0)
			this.game.speed = this.game.maxSpeed * 0;
		if (this.game.player.velocityX !== 0)
			this.game.speed = this.game.maxSpeed * 1;
		if (this.game.player.onGround())
			this.game.player.setState(states.STANDING, 0);

		if (input.pressed.includes(input.keys.roll))
			this.game.player.setState(states.ROLLING, 2);

		if (input.pressed.includes(input.keys.down))
			this.game.player.setState(states.DIVING, 0);
	}
}

export class Running extends State {
	constructor(game) {
		super("RUNNING");
		this.game = game;
	}

	enter() {
		this.game.player.frameX = 0;
		this.game.player.frameY = 3;
		this.game.player.maxFrames = 8;
	}

	handleInput(input) {
		// creating dust particles while running
		super.createDustParticles();
		if (
			!input.pressed.includes(input.keys.left) &&
			!input.pressed.includes(input.keys.right)
		)
			this.game.player.setState(states.STANDING, 0);

		if (input.lastPressedY === input.keys.up)
			this.game.player.setState(states.JUMPING, 1);

		if (input.lastPressedY === input.keys.down)
			this.game.player.setState(states.SITTING, 0);

		if (input.pressed.includes(input.keys.roll))
			this.game.player.setState(states.ROLLING, 2);
	}
}

export class Sitting extends State {
	constructor(game) {
		super("SITTING");
		this.game = game;
	}

	enter() {
		this.game.player.frameX = 0;
		this.game.player.frameY = 5;
		this.game.player.maxFrames = 4;
	}

	handleInput(input) {
		if (input.lastPressedY !== input.keys.down) {
			this.game.player.setState(states.STANDING, 0);
		}
	}
}

export class Rolling extends State {
	constructor(game) {
		super("ROLLING");
		this.game = game;
	}

	enter() {
		this.game.player.frameX = 0;
		this.game.player.frameY = 6;
		this.game.player.maxFrames = 6;
	}

	handleInput(input) {
		// creating fire particles while rolling
		super.createFireParticles();
		if (!input.pressed.includes(input.keys.roll) && this.game.player.onGround())
			this.game.player.setState(states.STANDING, 0);

		if (
			!input.pressed.includes(input.keys.roll) &&
			!this.game.player.onGround() &&
			this.game.player.velocityY > 0
		)
			this.game.player.setState(states.FALLING, 1);

		if (
			!input.pressed.includes(input.keys.roll) &&
			!this.game.player.onGround() &&
			this.game.player.velocityY < 0
		)
			this.game.player.setState(states.JUMPING, 1);

		if (input.pressed.includes(input.keys.down) && !this.game.player.onGround())
			this.game.player.setState(states.DIVING, 0);
	}
}

export class Diving extends State {
	constructor(game) {
		super("DIVING");
		this.game = game;
	}

	enter() {
		this.game.player.frameX = 0;
		this.game.player.frameY = 6;
		this.game.player.maxFrames = 6;
	}

	handleInput(input) {
		// creating fire particles while diving
		super.createFireParticles();
		if (
			this.game.player.onGround() &&
			input.pressed.includes(input.keys.roll)
		) {
			super.createSplashParticles();
			this.game.player.setState(states.ROLLING, 2);
		}

		if (
			this.game.player.onGround() &&
			(input.pressed.includes(input.keys.left) ||
				input.pressed.includes(input.keys.right))
		) {
			super.createSplashParticles();
			this.game.player.setState(states.RUNNING, 1);
		}

		if (
			this.game.player.onGround() &&
			!(
				input.pressed.includes(input.keys.left) ||
				input.pressed.includes(input.keys.right)
			)
		) {
			super.createSplashParticles();
			this.game.player.setState(states.STANDING, 0);
		}
	}
}

export class Dizzy extends State {
	constructor(game) {
		super("DIZZY");
		this.game = game;
	}

	enter() {
		this.game.player.frameX = 0;
		this.game.player.frameY = 4;
		this.game.player.maxFrames = 10;
	}

	handleInput(input) {
		if (this.game.player.frameX >= 10 && this.game.player.onGround()) {
			this.game.player.setState(states.STANDING, 0);
		}

		if (this.game.player.frameX >= 10 && !this.game.player.onGround()) {
			this.game.player.hit = false;
			this.game.player.setState(states.FALLING, 0);
		}
	}
}
