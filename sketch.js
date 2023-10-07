/*
	Author: Elai Joubert
*/

// Track data
var track;
var defaultTrack = 1;
var currentTrack = defaultTrack;

// Genetic algorithm stuff
const popSize = 30;
var population = [];
var crashedTotal = 0;
var loopTime = 300;
var counter = 0;
var bestEver;
var bestBrain;
var mutationRate = 1;

var cnv;


var player = null;

function preload() {
	track = loadJSON("data/Race_tracks/RaceTrack_" + currentTrack + ".json");
}

function setup() {
	cnv = createCanvas(800, 600);

	setupDOM();
	for (let i = 0; i < popSize; i++) {
		population[i] = new Car(700, 100);
	}

	bestEver = new Car(0, 0);

}

function draw() {
	background(0, 200, 0);

	//drawWalls();
	prettyUp(track.its);

	if (!bestOnly.checked()) {
		for (let v of population) {
			v.see(track.walls);
			v.show();
			v.update();
		}

		fr.html("Frames per second: " + int(frameRate()));
		gen.html("Generation: " + genCount);

		reset();
		counter = counter + 1;
	} else {
		bestEver.see(track.walls);
		bestEver.show();
		bestEver.update();

		if (bestEver.crashed) {
			bestEver.pos.x = 700;
			bestEver.pos.y = 100;
			bestEver.crashed = false;
		}
	}

	if (player) {
		player.see(track.walls);
		player.show();
		player.update();
	}
	/**/
}

function drawWalls() {
	stroke(255);
	for (var i = 0; i < track.walls.length - 1; i += 2) {
		line(
			track.walls[i].x,
			track.walls[i].y,
			track.walls[i + 1].x,
			track.walls[i + 1].y
		);
	}
}

function prettyUp(its) {
	strokeWeight(2);
	//The start of the inner track is required to know when to change shape (its)
	fill(125);
	stroke(0);
	beginShape();
	for (let i = 0; i < its; i++) {
		vertex(track.walls[i].x, track.walls[i].y);
	}
	endShape(CLOSE);

	fill(0, 200, 0);
	stroke(0);
	beginShape();
	for (let j = its; j < track.walls.length; j++) {
		vertex(track.walls[j].x, track.walls[j].y);
	}
	endShape(CLOSE);
	strokeWeight(1);
}
