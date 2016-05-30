var game = {};
var evolve = require('../lib/evolve');
var populationSize = 100;
var maxGenerations = 100;
var currentGenerations = 0;

var fittest = null;

game.create = function () {
  fittest = evolve.createInitialPopulation(populationSize, game);
};

game.update = function() {

  if (currentGenerations <= maxGenerations) {
    var fittestFromGeneration = evolve.nextGeneration(currentGenerations);
    currentGenerations ++;

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
