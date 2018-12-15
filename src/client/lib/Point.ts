export class Point {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(other: Point) {
		this.x += other.x;
		this.y += other.y;
	}

	sub(other: Point) {
		this.x -= other.x;
		this.y -= other.y;
	}

	mul(other: Point) {
		this.x *= other.x;
		this.y *= other.y;
	}

	div(other: Point) {
		this.x /= other.x;
		this.y /= other.y;
	}

	random(minX: number, minY: number, width: number, height: number) {
		this.x = minX + Math.random() * width;
		this.y = minY + Math.random() * height;
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	distanceTo(other: Point) {
		let temp = new Point(this.x - other.x, this.y - other.y);
		return temp.length();
	}

	toString() {
		return `new Point(${this.x},${this.y})`;
	}

	clampX(min: number, max: number) {
		if (this.x < min) this.x = min;
		else if (this.x > max) this.x = max;
	}

	clampY(min: number, max: number) {
		if (this.y < min) this.y = min;
		else if (this.y > max) this.y = max;
	}
}

export type PointList = Point[];
