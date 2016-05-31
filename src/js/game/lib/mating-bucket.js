var _ = require('lodash');

module.exports = {

  bucket: [],

  population: null,

  populate: function(population) {

    this.population = population;

    _.each(population, _.bind(function(item, index) {

      var bucketSlots = Math.round(item.normalisedFitness * 100);
      _.times(bucketSlots, _.bind(function() {
        this.bucket.push(index);
      }, this));
    }, this));
  },

  getMate: function() {
    var mateIndex = _.sample(this.bucket);
    return this.population[mateIndex];
  },

  getNewPopulation: function(population) {
    this.populate(population);
    var newPopulation = [];

    _.each(this.population, _.bind(function() {
      newPopulation.push(this.getMate());
    }, this));

    return newPopulation;
  }
};
