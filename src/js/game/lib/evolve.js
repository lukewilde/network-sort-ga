var Network = require('./network');
var matingBucket = require('./mating-bucket');
var smallNetwork = require('../graphs/small');
var _ = require('lodash');
var partners = [];
var population = [];

module.exports = function(populationSize, maxGenerations, game) {
  population = createInitialPopulation(populationSize, game);

  var fittest = null;

  _.times(maxGenerations, function(index) {

    setNormalisedFitness(population);

    var fittestFromGeneration = sortByFitness(population).shift();
    fittestFromGeneration.generation = index;

    console.log('generation %s: %s', index, fittestFromGeneration.fitness);

    var isFirstGeneration = fittest === null;

    if (isFirstGeneration || fittest.fitness > fittestFromGeneration.fitness) {
      fittest = fittestFromGeneration;
    }

    partners = [];

    matingBucket.populate(population);

    _.times(populationSize, matchPartners);

    population = _.map(partners, function(couple) {
      return couple[0].coinFlipMate(couple[1]);
    });
  });

  console.log('fittest dude ever', fittest.generation, fittest.fitness);

  return fittest;
};

function matchPartners () {
  var a = matingBucket.getMate();
  var b = matingBucket.getMate(a);

  if (!a || !b) {
    console.log(a, b);
  }

  partners.push([a, b]);
}

function createInitialPopulation(populationSize, game) {

  var population = [];

  _.times(populationSize, function() {
    var network = new Network(smallNetwork, game);
    network.getFirstGeneration();
    population.push(network);
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
  return _.sortBy(population, 'fitness');
}
