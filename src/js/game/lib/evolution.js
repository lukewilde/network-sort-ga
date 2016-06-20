var Network = require('./network');
var matingBucket = require('./mating-bucket');
var networkConfig = require('../graphs/small');
// var networkConfig = require('../graphs/large');
var _ = require('lodash');

module.exports = {
  fittest: null,
  partners: [],
  population: [],
  populationSize: 0,
  chartData: [['Generation', 'Fitness']],

  createInitialPopulation: function (populationSize, game) {

    this.populationSize = populationSize;

    _.times(populationSize, _.bind(function() {
      var network = new Network(networkConfig, game);
      network.getFirstGeneration();
      this.population.push(network);
    }, this));

    // this.setNormalisedFitness();
    this.addToChartData(0);

    return _.last(this.sortByFitness());
  },

  nextGeneration: function(generationIndex) {

    var fittestFromGeneration = _.last(this.sortByFitness());
    fittestFromGeneration.generation = generationIndex + 1;

    this.population = matingBucket.getNewPopulation(this.sortByFitness());

    this.population = _.map(this.population, function(network) {
      return network.mutate();
    });

    // this.setNormalisedFitness();
    this.addToChartData(generationIndex);

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

  addToChartData: function(generation) {
    _.each(this.population, _.bind(function(network) {
      this.chartData.push([generation, network.fitness]);
    }, this));
  },

  sortByFitness: function () {
    return _.sortBy(this.population, function(network) {
      return network.fitness * -1;
    });
  }

};
