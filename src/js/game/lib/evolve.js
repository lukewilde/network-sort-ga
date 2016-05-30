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
    fittestFromGeneration.generation = generationIndex;

    matingBucket.populate(this.population);

    this.partners = [];
    _.times(this.populationSize, _.bind(matchPartners, this));

    this.population = _.map(this.partners, function(couple) {
      return couple[0].coinFlipMate(couple[1]);
    });

    this.setNormalisedFitness();

    return fittestFromGeneration;
  },

  setNormalisedFitness: function () {
    var totalFitness = _.sumBy(this.population, 'fitness');
    _.each(this.population, function(network) {
      network.normalisedFitness = network.fitness / totalFitness;
    });
  },

  sortByFitness: function () {
    return _.sortBy(this.population, function(network) {
      return network.fitness * -1;
    });
  }

};

function matchPartners () {
  var a = matingBucket.getMate();
  var b = matingBucket.getMate(a);

  if (!a || !b) {
    console.log(a, b);
  }

  this.partners.push([a, b]);
}
