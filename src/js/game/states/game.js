var game = {};
var evolve = require('../lib/evolve');
var populationSize = 100;
var maxGenerations = 100;
var currentGeneration = 0;

var fittest = null;
var fittestFromGeneration = null;
var reported = false;

game.create = function () {
  fittest = evolve.createInitialPopulation(populationSize, game);
};

game.update = function() {

  var done = currentGeneration >= maxGenerations;

  if (done && !reported) {
    fittest.reportFitness();
    console.log(fittest.showRealFitness());
    reported = true;
    fittestFromGeneration = fittest;
    return;
  } else if (done) {
    return;
  }

  if (!done) {

    fittestFromGeneration = evolve.nextGeneration(currentGeneration);
    currentGeneration ++;

    console.log('Generation %s: %s', currentGeneration, fittestFromGeneration.showRealFitness());

    if (fittest.normalisedFitness < fittestFromGeneration.normalisedFitness) {
      fittest = fittestFromGeneration;
    }
  }

};

game.render = function() {
  // Destroy all old graphics.
  game.world.removeAll();
  fittestFromGeneration.draw();
};

module.exports = game;
