var _ = require('lodash');
var Node = require('./Node');

function Network(config, game) {
  this.nodes = [];

  this.sizeWeighting = 1;

  this.intersectionWeighting = 10;

  this.weighting = {
    size: 1,
    area: 25,
    lines: 300,
    intersect: 1000
  };

  _.each(config, _.bind(function(nodeConfig) {
    this.nodes.push(new Node(nodeConfig, null, game));
  }, this));

  _.each(this.nodes, _.bind(function (node) {
    node.setConnections(this.nodes);
  }, this));
}

Network.prototype.reportFitness = function() {
  var fitness = 0;
  var results = [];

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

    fitness += size + areaOfOverlappingNodes + numberOfOverlappingLines + numberOfLinesIntersectingNodes;
  }, this));

  console.table(results);
};

Network.prototype.getFitness = function() {

  var fitness = 0;
  // var results = [];

  _.each(this.nodes, _.bind(function(node) {

    // Calculate total line distance.
    var size = node.getConnectionDistance() * this.weighting.size;

    // Check for nodes overlapping.
    var areaOfOverlappingNodes = node.getAreaOfOverlappingNodes() * this.weighting.area;

    // check for line intersections.
    var numberOfOverlappingLines = node.getNumberOfIntersectingLines() * this.weighting.lines;

    // check if lines intersect with other nodes.
    var numberOfLinesIntersectingNodes = node.getNumberOfLineNodeIntersects() * this.weighting.intersect;

    fitness += size + areaOfOverlappingNodes + numberOfOverlappingLines + numberOfLinesIntersectingNodes;
  }, this));

  return fitness;
};

Network.prototype.draw = function() {

  _.each(this.nodes, function(node) {
    node.drawBox();
  });

  _.each(this.nodes, function(node) {
    node.drawConnections();
  });
};

module.exports = Network;
