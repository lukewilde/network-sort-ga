var _ = require('lodash');
var Node = require('./Node');

module.exports = {

  nodes: [],

  init: function(network, game) {
    _.each(network, _.bind(function(nodeConfig) {
      this.nodes.push(new Node(nodeConfig, this.nodes, game));
    }, this));
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
