var _ = require('lodash');

module.exports = {

  bucket: [],

  population: null,

  populate: function(population, length) {

    this.population = population;

    _.each(population, _.bind(function(item, index) {

      var bucketSlots = Math.round(length / (index + 2));

      _.times(bucketSlots, _.bind(function() {
        this.bucket.push(index);
      }, this));
    }, this));
  },

  spawnFromPopulation: function(population) {
    this.population(population, population.length);
  },

  spawnFromSelection: function(population, length) {
    this.populate(population, length);
  },

  getMate: function() {
    var mateIndex = _.sample(this.bucket);
    return this.population[mateIndex];
  },

  getNewPopulation: function(population) {
    this.spawnFromPopulation(population);
    var newPopulation = [];

    _.each(this.population, _.bind(function() {
      newPopulation.push(this.getMate());
    }, this));

    return newPopulation;
  }
};
