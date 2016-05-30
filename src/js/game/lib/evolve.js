var Network = require('./network');
var smallNetwork = require('../graphs/small');
var _ = require('lodash');

module.exports = function(populationSize, game) {
  var population = createInitialPopulation(populationSize, game);
  setNormalisedFitness(population);

  var fittest = sortByFitness(population).pop();

  return fittest;
};

function createInitialPopulation(populationSize, game) {

  var population = [];

  _.times(populationSize, function() {
    population.push(new Network(smallNetwork, game));
  });

  return population;
}

function setNormalisedFitness(population) {
  var totalFitness = getTotal(_.map(population, 'fitness'));
  _.each(population, function(network) {
    network.normalisedFitness = network.fitness / totalFitness;
  });
}

function getTotal(values) {
  var total = 0;
  _.each(values, function(value) {
    total += value;
  });

  return total;
}

function sortByFitness(population) {
  return _.sortBy(population, 'fitness', 'desc');
}
