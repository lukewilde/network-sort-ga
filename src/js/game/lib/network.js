var _ = require('lodash');
var Node = require('./Node');

module.exports = {

  nodes: [],

  fitness: Infinity,

  sizeWeighting: 1,

  intersectionWeighting: 10,

  weighting: {
    size: 1,
    area: 20,
    lines: 300,
    intersect: 1000
  },

  config: null,

  init: function(config, game) {

    this.config = config;

    _.each(config, _.bind(function(nodeConfig) {
      this.nodes.push(new Node(nodeConfig, null, game));
    }, this));

    _.each(this.nodes, _.bind(function (node) {
      node.setConnections(this.nodes);
    }, this));
  },

  calculateFitness: function() {

    this.fitness = 0;
    var results = [];

    console.info('Calculating Fitness');
    _.each(this.nodes, _.bind(function(node) {

      // Calculate total line distance.
      var size = node.getConnectionDistance() * this.weighting.size;

      // Check for nodes overlapping.
      var areaOfOverlappingNodes = node.getAreaOfOverlappingNodes() * this.weighting.area;

      // check for line intersections.
      var numberOfOverlappingLines = node.getNumberOfIntersectingLines() * this.weighting.lines;

      // check if lines intersect with other nodes.
      var numberOfLinesIntersectingNodes = node.getNumberOfLineNodeIntersects() * this.weighting.intersect;

      results.push({
        name: node.name,
        size: size,
        areaOfOverlappingNodes: areaOfOverlappingNodes,
        numberOfOverlappingLines: numberOfOverlappingLines,
        numberOfLinesIntersectingNodes: numberOfLinesIntersectingNodes
      });

      this.fitness += size + areaOfOverlappingNodes;
    }, this));

    console.table(results);
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
