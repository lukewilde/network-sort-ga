var _ = require('lodash');
var Node = require('./Node');

module.exports = {

  nodes: [],

  config: null,

  init: function(config, game) {

    this.config = config;

    _.each(config, _.bind(function(nodeConfig) {
      this.nodes.push(new Node(nodeConfig, null, this.nodes, game));
    }, this));
  },

  calculateFitness: function() {

  },

  draw: function() {

    _.each(this.nodes, function(node) {
      node.drawBox();
    });

    _.each(this.nodes, function(node) {
      node.drawConnections();
    });
  }
};
