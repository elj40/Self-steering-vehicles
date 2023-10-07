/*
	Author: Elai Joubert
*/

//DOM elements
var fr;
var debug;
var gen;
var genCount = 1;
var dudButton;
var stopLearning;
var saveBest;
var dropCarData;
var bestOnly;
var onlyBest = false;
var joinIn;

var pickColor;
let c;

function setupDOM() {
	fr = select(".frameRate-holder");

	gen = select(".generationP");

	debug = select(".debug-checkBox");

	stopLearning = select(".stop-checkBox");

	bestOnly = select(".bestOnly-checkBox");

	dudButton = select(".dud-button");
	dudButton.mousePressed(dud);

	saveBest = select(".saveBest-button");
	saveBest.mousePressed(saveBestCar);

	joinIn = select(".joinIn-button");
	joinIn.mousePressed(joinRace);

	dropCarData = select(".drop-car-data");
	dropCarData.dragOver(highlight);
	dropCarData.dragLeave(unhighlight);
	dropCarData.drop(gotFile, unhighlight);

	pickColor = select(".myColor");

	//Canvas styling
	cnv.style('position' ,"relative");
	cnv.style('left' ,"18%");
	cnv.style("border-radius", "10px");

}

function dud() {
	restart();
}

function highlight() {
	dropCarData.style("background-color", "#11a1a1");
}
function unhighlight() {
	dropCarData.style("background-color", "#313131");
}

function gotFile(file) {
	if (file.subtype == "json") {
		loadJSON(file.data, jsonLoaded);
	} else {
		alert("Only JSON file types are accepted");
	}
}

function jsonLoaded(info) {
	let str = "";
	for (let i in info) {
		str += info[i];
	}
	let data = JSON.parse(str);
	let brain = NeuralNetwork.deserialize(data);
	restart(brain);
	alert("New AI is being used");
}

function newTrack(n) {
	console.log("Using race track " + n);
	loadJSON("data/Race_tracks/RaceTrack_" + n + ".json", trackRestart);
	alert("Race track " + n + " is being used");
}

function trackRestart(track_) {
	track = track_;
	restart();
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function joinRace() {
	c = pickColor.value();
	let col = hexToRgb(c);
	let realCol = color(col.r, col.g, col.b);

	if (player) player = null
	else player = new Player(700, 100, realCol);
}