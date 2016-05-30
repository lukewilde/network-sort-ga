var game = {};
var evolve = require('../lib/evolve');
var populationSize = 100;
var maxGenerations = 100;
var currentGeneration = 0;

var fittest = null;

var reported = false;

game.create = function () {
  fittest = evolve.createInitialPopulation(populationSize, game);
};

game.update = function() {

  var done = currentGeneration >= maxGenerations;

  if (done && !reported) {
    fittest.reportFitness();
    reported = true;
    return;
  } else if (done) {
    return;
  }

  if (!done) {
    var fittestFromGeneration = evolve.nextGeneration(currentGeneration);
    currentGeneration ++;

    console.log('Generation %s: %s', currentGeneration, fittest.showRealFitness(), fittest.normalisedFitness);

    if (fittest.normalisedFitness < fittestFromGeneration.normalisedFitness) {
      fittest = fittestFromGeneration;
    }
  }
};

game.render = function() {
  // Destroy all old graphics.
  game.world.removeAll();

  fittest.draw();
};

module.exports = game;
