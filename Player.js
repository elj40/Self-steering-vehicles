class Player {
	constructor(x, y, col) {
		this.startPos = createVector(x, y);
		this.pos = createVector(x, y);
		this.vel = createVector(0, 0.1);
		this.acc = createVector(0, 0);

		this.maxSpeed = 4.5;
		this.maxForce = 1;
		this.maxLine = 100;

		this.lineLength = this.maxLine;

		this.lineCount = 5;

		this.lineLengths = [];
		for (let i = 0; i < this.lineCount; i++) {
			this.lineLengths[i] = this.maxLine;
		}

		this.r = 8;

		this.crashed = false;

		this.col = col;
	}

	move() {
		this.acc.limit(this.maxForce);
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);


		this.pos.add(this.vel);
		this.acc.mult(0);

		let spd = 0;
		let spdVal = 0.1;
		if (keyIsDown(87)) spd = spdVal;
		if (keyIsDown(83)) spd = -spdVal;
		if (keyIsDown(65)) this.vel.rotate(-0.07);
		if (keyIsDown(68)) this.vel.rotate(0.07);

		let a = this.vel.heading();
		let forward = p5.Vector.fromAngle(a);
		forward.setMag(spd);

		this.applyForce(forward);
	}

	update() {
		this.move();
		for (let i = 0; i < this.lineCount; i++) {
			this.lineLengths[i] = this.maxLine;
		}


		if (this.crashed) {
			joinRace();
		}
	}

	applyForce(force) {
		this.acc.add(force);
	}

	show() {

		fill(this.col,200);
		stroke(this.col);

		push();

		translate(this.pos.x, this.pos.y);
		var dir = this.vel.heading() + Math.PI / 2;
		rotate(dir);

		beginShape();

		vertex(0, -this.r);
		vertex(this.r / 2, this.r);
		vertex(0, this.r / 2);
		vertex(-this.r / 2, this.r);

		endShape(CLOSE);

		pop();

	}

	segIntersects(p0, p1, p2, p3) {
		var A1 = p1.y - p0.y,
			B1 = p0.x - p1.x,
			C1 = A1 * p0.x + B1 * p0.y;

		var A2 = p3.y - p2.y,
			B2 = p2.x - p3.x,
			C2 = A2 * p2.x + B2 * p2.y;

		var denominator = A1 * B2 - A2 * B1;

		if (denominator == 0) {
			return null;
		}

		var intersectX = (B2 * C1 - B1 * C2) / denominator,
			intersectY = (A1 * C2 - A2 * C1) / denominator;

		var rx0 = (intersectX - p0.x) / (p1.x - p0.x),
			ry0 = (intersectY - p0.y) / (p1.y - p0.y);

		var rx1 = (intersectX - p2.x) / (p3.x - p2.x),
			ry1 = (intersectY - p2.y) / (p3.y - p2.y);

		if (
			((rx0 >= 0 && rx0 <= 1) || (ry0 >= 0 && ry0 <= 1)) &&
			((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1))
		) {
			return createVector(intersectX, intersectY);
		} else {
			return null;
		}
	}

	see(walls) {
		let p0 = this.pos.copy();

		for (let i = 0; i < this.lineCount; i++) {
			let record = this.lineLengths[i];

			let angle =
				this.vel.heading() -
				Math.PI / 2 +
				(Math.PI / (this.lineCount - 1)) * i;
			let x = this.lineLengths[i] * cos(angle) + this.pos.x;
			let y = this.lineLengths[i] * sin(angle) + this.pos.y;

			let p1 = createVector(x, y);

			for (let i = 0; i < walls.length; i += 2) {
				let p2 = walls[i];
				let p3 = walls[i + 1];

				let a = this.segIntersects(p0, p1, p2, p3);
				let d;
				if (a !== null) d = this.pos.dist(a);
				if (d < record) record = d;
			}
			if (record < this.r - 4 && !this.crashed) {
				this.crashed = true;
			}
			this.lineLengths[i] = record;
		}
	}
}
