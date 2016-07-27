var _ = require('lodash');
var Network = require('./network');
var matingBucket = require('./mating-bucket');
// var networkConfig = require('../graphs/small');
var networkConfig = require('../graphs/large');

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

    return _.first(this.sortByFitness());
  },

  createPopulationFromSelection: function(topFromChoas, targetFitness) {

    var fittest = _.first(_.sortBy(topFromChoas, 'fitness'));
    var elites = [];

    _.each(topFromChoas, function(network) {
      if (network.fitness === fittest.fitness) {
        network.disableRapidMutation();
        elites.push(network);
      }
    });

    this.population = matingBucket.getChildrenFromSelection(elites, this.populationSize);

    return fittest;
  },

  nextGeneration: function(generationIndex) {

    var generation = this.sortByFitness();
    var fittest = _.first(generation);

    this.population = matingBucket.getChildrenFromPopulation(generation);

    this.population = _.map(this.population, function(network) {
      return network.mutate(generationIndex);
    });

    return fittest;
  },

  sortByFitness: function () {
    return _.sortBy(this.population, function(network) {
      return network.fitness;
    });
  }

};
