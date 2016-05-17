var _ = require('lodash');
var Node = require('./Node');

module.exports = {

  nodes: [],

  fitness: Infinity,

  sizeWeighting: 1,

  intersectionWeighting: 10,

  config: null,

  init: function(config, game) {

    this.config = config;

    _.each(config, _.bind(function(nodeConfig) {
      this.nodes.push(new Node(nodeConfig, null, this.nodes, game));
    }, this));
  },

  calculateFitness: function() {

    this.fitness = 0;

    var size = 0;
    var areaOfOverlappingNodes = 0;

    console.info('Calculating Fitness');
    _.each(this.nodes, _.bind(function(node) {

      // Calculate total line distance.
      size += node.getConnectionDistance() * this.sizeWeighting;

      // Check for nodes overlapping.
      areaOfOverlappingNodes = node.getAreaOfOverlappingNodes() * this.intersectionWeighting;

      // check for line intersections.

      console.info('size %s, overlapping area %s', size, areaOfOverlappingNodes);
      this.fitness += size + areaOfOverlappingNodes;

    }, this));

    console.info('total fitness:', this.fitness);
  },

  draw: function() {

    _.each(this.nodes, function(node) {
      node.drawBox();
    });

    _.each(this.nodes, function(node) {
      node.drawConnections();
    });

    this.calculateFitness();
  }
};
