export default class InputHandler {
	constructor(game, keyUp, keyDown, keyLeft, keyRight, keyRoll) {
		this.game = game;
		this.lastPressedX = "";
		this.lastPressedY = "";
		this.lastInput = "";
		this.pressed = [];
		this.keys = {
			up: keyUp,
			down: keyDown,
			left: keyLeft,
			right: keyRight,
			roll: keyRoll,
		};

		window.addEventListener("keydown", (e) => {
			if (e.key === "d") this.game.debug = !this.game.debug;
			if (!this.pressed.includes(e.key)) this.pressed.push(e.key);
			this.lastInput = e.key;
			if (e.key === this.keys.left || e.key === this.keys.right)
				this.lastPressedX = e.key;
			if (e.key === this.keys.up || e.key === this.keys.down)
				this.lastPressedY = e.key;
		});

		window.addEventListener("keyup", (e) => {
			this.pressed.splice(this.pressed.indexOf(e.key), 1);
			if (
				(e.key === this.keys.left || e.key === this.keys.right) &&
				!this.pressed.includes(this.keys.left) &&
				!this.pressed.includes(this.keys.right)
			)
				this.lastPressedX = "";
			if (
				(e.key === this.keys.up || e.key === this.keys.down) &&
				!this.pressed.includes(this.keys.up) &&
				!this.pressed.includes(this.keys.down)
			)
				this.lastPressedY = "";

			if (e.key === this.keys.left && this.pressed.includes(this.keys.right))
				this.lastPressedX = this.keys.right;

			if (e.key === this.keys.right && this.pressed.includes(this.keys.left))
				this.lastPressedX = this.keys.left;

			if (e.key === this.keys.up && this.pressed.includes(this.keys.down))
				this.lastPressedY = this.keys.down;

			if (e.key === this.keys.down && this.pressed.includes(this.keys.up))
				this.lastPressedY = this.keys.up;
		});
	}
}
