var _ = require('lodash');

module.exports = {

  bucket: [],

  population: [],

  populateByRank: function(population, length) {

    this.population = population;
    this.bucket = [];

    _.each(population, _.bind(function(item, index) {

      // Because the population is in order by fitness, we can use the index
      // as a divisor which gives more bucket slots for earlier items.
      var bucketSlots = Math.round(length / (index + 2));

      _.times(bucketSlots, _.bind(function() {
        this.bucket.push(index);
      }, this));
    }, this));
  },

  populateEqually: function(population) {
    this.population = population;
    this.bucket = [];

    _.each(population, _.bind(function(item, index) {
      this.bucket.push(index);
    }, this));
  },

  getChildFromBucket: function() {
    var mateIndex = _.sample(this.bucket);
    return this.population[mateIndex];
  },

  getChildrenFromSelection: function(population, length) {
    this.populateEqually(population, length);
    return this.getChildren(length);
  },

  getChildrenFromPopulation: function(population) {
    this.populateByRank(population, population.length);
    return this.getChildren(population.length);
  },

  getChildren: function(populationSize) {
    var children = [];

    _.times(populationSize, _.bind(function() {
      children.push(this.getChildFromBucket());
    }, this));

    return children;
  }
};
