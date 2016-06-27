var _ = require('lodash');
var Network = require('./network');
var matingBucket = require('./mating-bucket');
// var networkConfig = require('../graphs/small');
var networkConfig = require('../graphs/large');
var reporting = require('../lib/reporting');

module.exports = {
  fittest: null,
  population: [],
  populationSize: 0,

  createInitialPopulation: function (populationSize, game, rapidMutation) {
    this.populationSize = populationSize;
    this.population = [];

    _.times(populationSize, _.bind(function() {
      var network = new Network(networkConfig, game, rapidMutation);

      network.getFirstGeneration();
      this.population.push(network);
    }, this));

    var fittest = _.first(this.sortByFitness());
    reporting.addToChartData(0, fittest);

    return fittest;
  },

  createPopulationFromSelection: function(topFromChoas) {

    var fittest = _.first(_.sortBy(topFromChoas, 'fitness'));
    var elites = [];

    _.each(topFromChoas, function(network) {
      if (network.fitness === fittest.fitness) {
        network.rapidMutation = false;
        elites.push(network);
      }
    });

    this.population = matingBucket.getChildrenFromSelection(elites, this.populationSize);

    reporting.addToChartData(0, this.population[0]);

    return fittest;
  },

  nextGeneration: function(generationIndex) {

    var generation = this.sortByFitness();
    var fittest = _.first(generation);

    fittest.generation = generationIndex + 1;

    this.population = matingBucket.getChildrenFromPopulation(generation);

    this.population = _.map(this.population, function(network) {
      return network.mutate();
    });

    reporting.addToChartData(generationIndex, fittest);

    return fittest;
  },

  sortByFitness: function () {
    return _.sortBy(this.population, function(network) {
      return network.fitness;
    });
  }

};
