var game = {};
var evolve = require('../lib/evolve');
var populationSize = 100;

game.create = function () {
  var fittest = evolve(populationSize, this.game);

  fittest.draw();
  fittest.reportFitness();
};

module.exports = game;
