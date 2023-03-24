export class UI {
	constructor(game) {
		this.game = game;
		this.fontSize = 35;
		this.fontFamily = "Creepster";
		this.fontFamily = "Bangers";
		this.livesImage = livesImage;
		this.livesImageSize = 25;
	}

	draw(context) {
		context.save();
		context.shadowOffsetX = 3;
		context.shadowOffsetY = 3;
		context.shadowColor = "#ddd";
		// score
		context.font = `bold ${this.fontSize}px ${this.fontFamily}`;
		context.textAlign = "left";
		context.fillStyle = this.game.fontColor;
		context.fillText(`Score: ${this.game.score}`, 20, 50);

		// timer
		context.font = `bold ${this.fontSize * 0.8}px ${this.fontFamily}`;
		context.fillStyle = this.game.fontColor;
		context.fillText(`Time: ${(this.game.time * 0.001).toFixed(1)}`, 20, 80);

		// lives
		for (let i = 0; i < this.game.livesLeft; i++) {
			context.drawImage(
				this.livesImage,
				(this.livesImageSize + 4) * i + 20,
				95,
				this.livesImageSize,
				this.livesImageSize
			);
		}

		// Game Over message
		if (this.game.gameOver) {
			context.shadowColor = "#000";
			context.fillStyle = "#ccc";
			context.textAlign = "center";
			context.font = `bold ${this.fontSize * 2}px ${this.fontFamily}`;
			if (this.game.score > this.game.winningScore) {
				context.fillText(
					`Boo-yah`,
					this.game.width * 0.5,
					this.game.height * 0.5 - 20
				);
				context.font = `bold ${this.fontSize * 0.7}px ${this.fontFamily}`;
				context.fillText(
					`What are creatures of the night afraid of? YOU!!!`,
					this.game.width * 0.5,
					this.game.height * 0.5 + 20
				);
			} else {
				context.fillText(
					`Love at first bite?`,
					this.game.width * 0.5,
					this.game.height * 0.5 - 20
				);
				context.font = `bold ${this.fontSize * 0.7}px ${this.fontFamily}`;
				context.fillText(
					`Nope. Better luck next time!`,
					this.game.width * 0.5,
					this.game.height * 0.5 + 20
				);
			}
		}
		context.restore();
	}
}
