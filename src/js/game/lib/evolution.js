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

    var fittest = _.first(this.sortByFitness());
    this.addToChartData(0, fittest);

    return fittest;
  },

  nextGeneration: function(generationIndex) {

    var fittest = _.first(this.sortByFitness());

    fittest.generation = generationIndex + 1;

    this.population = matingBucket.getNewPopulation(this.sortByFitness());

    this.population = _.map(this.population, function(network) {
      return network.mutate();
    });

    this.addToChartData(generationIndex, fittest);

    return fittest;
  },

  addToChartData: function(generation, fittestNetwork) {
    this.chartData.push([generation, fittestNetwork.fitness]);
  },

  sortByFitness: function () {
    return _.sortBy(this.population, function(network) {
      return network.fitness;
    });
  }

};
