export class FloatingMessage {
	constructor(value, x, y, targetX, targetY) {
		this.value = value;
		this.positionX = x;
		this.positionY = y;
		this.targetX = targetX;
		this.targetY = targetY;
		this.markedForDeletion = false;
		this.timer = 0;
		this.deletionInterval = 4000;
		this.fontSize = 20;
		this.fontFamily = "Bangers";
		this.shadowOffset = 1;
		this.messageSpeedRatio = 3;
	}

	update(deltaTime) {
		this.positionX +=
			(((this.targetX - this.positionX) * deltaTime) / this.deletionInterval) *
			this.messageSpeedRatio;
		this.positionY +=
			(((this.targetY - this.positionY) * deltaTime) / this.deletionInterval) *
			this.messageSpeedRatio;
		this.timer += deltaTime;
		if (this.timer > this.deletionInterval) this.markedForDeletion = true;
	}

	draw(context) {
		context.font = `${this.fontSize}px ${this.fontFamily}`;
		context.fillStyle = "white";
		context.fillText(this.value, this.positionX, this.positionY);
		context.fillStyle = "black";
		context.fillText(
			this.value,
			this.positionX + this.shadowOffset,
			this.positionY + this.shadowOffset
		);
	}
}
