var game = {};
var matingBucket = require('../lib/mating-bucket');
var populationSize = 100;

game.create = function () {
  var fittest = matingBucket(populationSize, this.game);

  fittest.draw();
  fittest.reportFitness();
};

module.exports = game;
