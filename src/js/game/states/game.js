var game = {};
var evolve = require('../lib/evolve');
var populationSize = 100;
var maxGenerations = 100;

game.create = function () {
  var fittest = evolve(populationSize, maxGenerations, this.game);

  fittest.draw();
  fittest.reportFitness();
};

module.exports = game;
