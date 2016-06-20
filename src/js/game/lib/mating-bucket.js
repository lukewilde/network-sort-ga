var _ = require('lodash');

module.exports = {

  bucket: [],

  population: null,

  populate: function(population) {

    this.population = population;

    _.each(population, _.bind(function(item, index) {

      // By working out the difference from the mean, we can exaggerate the normalised fitness.
      // This widens the gap between high and low value networks.
      var mean = _.mean(_.map(population, 'normalisedFitness'));
      var exaggeratedFitness = item.normalisedFitness * ((item.normalisedFitness - mean) + 1);
      var bucketSlots = Math.round(exaggeratedFitness * (population.length * 100));

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
