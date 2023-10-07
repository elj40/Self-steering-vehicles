function nextGen() {

	calculateFitness();

  	crashedTotal = 0;
  	counter = 0;
  	loopTime += 10;

  	genCount++;

  	mutationRate *= 0.98;
  	//console.log(mutationRate)

  	//console.log(loopTime);

	for (var i = 0;i < popSize; i++) {
  		if (population[i].score > bestEver.score) {
  			bestEver = population[i];
  		}
  		population[i] = pickOne();
  	}

}

function pickOne() {
	var index = 0;
	var r = random();

	while (r > 0) {
		r = r - population[index].fitness;
		index++;
	}
	index--;

	let parent = population[index];
	let child = new Car(700, 100, highestScore().brain);
	
	child.mutate(mutator);
	return child;
}

function calculateFitness() {
	let big;
	let small = 0;
	for (var i = 0; i < population.length; i++) {
		if (population[i].score >= 0) big += population[i].score;
		else small += population[i].score;
	}

	for (var i = 0; i < population.length; i++) {
		population[i].fitness = map(population[i].score, small, big, 0, 1);
	}
}
function mutator(val, i, j) {
	return val + random(-mutationRate, mutationRate);
}

function highestScore() {
	let record = population[0].score;
	let best = population[0];

	for (let i = 1; i < population.length; i++) {
		if (population[i].score > record) {
			record = population[i].score;
			best = population[i];
		}
	}

	//best.mutate(mutator);

	return best;
}

function reset() {
	if ((crashedTotal == popSize || counter >= loopTime) && !stopLearning.checked()) {
		nextGen();
	}
}

function restart(brain) {
	if (brain) {
		console.log("New brain being used")
	  	for (let i = 0; i < popSize; i++) {
	  		population[i] = new Car(700,100,brain);
	 	}
	}else {
		console.log("Random cars being made")
		for (let i = 0; i < popSize; i++) {
	  		population[i] = new Car(700,100);
	 	}
	}

 	crashedTotal = 0;
  	counter = 1;
  	loopTime = 300;

  	genCount = 1;

  	mutationRate = 1;
}

function saveBestCar() {
	let json = bestEver.brain.serialize();
	saveJSON(json, "Best car.json");
}