var _ = require('lodash');
var bucketSize = 100;

module.exports = {

  bucket: [],

  population: null,

  populate: function(population) {

    this.population = population;

    _.each(population, _.bind(function(item, index) {

      var bucketSlots = Math.round(item.normalisedFitness * bucketSize);

      _.times(bucketSlots, _.bind(function() {
        this.bucket.push(index);
      }, this));

    }, this));
  },

  getMate: function(item) {

    var mateIndex = _.sample(this.bucket);
    var mate = this.population[mateIndex];

    if (!item) {
      return mate;
    }

    var itemIndex = _.indexOf(this.population, item);

    do {
      mateIndex = _.sample(this.bucket);
    } while (itemIndex === mateIndex);

    return this.population[mateIndex];
  }
};
