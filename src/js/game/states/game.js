var game = {};
var Network = require('../lib/network');
var smallNetwork = require('../graphs/small');
var _ = require('lodash');

game.create = function () {

  var fittestNetwork;
  var lowScore = Infinity;

  _.times(100, _.bind(function() {
      var network = new Network(smallNetwork, this.game);
      var fitness = network.getFitness();

      if (fitness < lowScore) {
        fittestNetwork = network;
        lowScore = fitness;
      }
    }, this));

  fittestNetwork.draw();
  fittestNetwork.reportFitness();
  console.log('winning fitness: %s', lowScore);
};

module.exports = game;
