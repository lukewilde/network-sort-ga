var Network = require('./network');
var matingBucket = require('./mating-bucket');
var smallNetwork = require('../graphs/small');
var _ = require('lodash');

module.exports = {
  fittest: null,
  partners: [],
  population: [],
  populationSize: 0,

  createInitialPopulation: function (populationSize, game) {

    this.populationSize = populationSize;

    _.times(populationSize, _.bind(function() {
      var network = new Network(smallNetwork, game);
      network.getFirstGeneration();
      this.population.push(network);
    }, this));

    this.setNormalisedFitness();

    return this.sortByFitness().pop();
  },

  nextGeneration: function(generationIndex) {

    var fittestFromGeneration = this.sortByFitness().pop();
    fittestFromGeneration.generation = generationIndex + 1;

    this.population = matingBucket.getNewPopulation(this.sortByFitness());

    this.population = _.map(this.population, function(network) {
      return network.mutate();
    });

    this.setNormalisedFitness();

    return fittestFromGeneration;
  },

  setNormalisedFitness: function () {

    var max = this.sortByFitness().shift();

    _.each(this.population, function(network) {
      network.differenceFitness = max.fitness - network.fitness;
    });

    var totalFitness = _.sumBy(this.population, 'differenceFitness');
    _.each(this.population, function(network) {
      network.normalisedFitness = network.differenceFitness / totalFitness;
    });
  },

  sortByFitness: function () {
    return _.sortBy(this.population, function(network) {
      return network.fitness * -1;
    });
  }

};
