var _ = require('lodash');
var Node = require('./Node');

function Network(config, game) {
  this.nodes = [];

  this.sizeWeighting = 1;

  this.intersectionWeighting = 10;

  this.weighting = {
    size: 5,
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

  this.genotype = this.getGenotype();
}

Network.prototype.reportFitness = function() {
  return _.map(this.nodes, 'genotype');
};

Network.prototype.reportFitness = function() {
  this.getFitness(true);
};

Network.prototype.getFitness = function(doReporting) {

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

    if (doReporting) {
      results.push({
        name: node.name,
        size: size,
        areaOfOverlappingNodes: areaOfOverlappingNodes,
        numberOfOverlappingLines: numberOfOverlappingLines,
        numberOfLinesIntersectingNodes: numberOfLinesIntersectingNodes
      });
    }

    fitness += size + areaOfOverlappingNodes + numberOfOverlappingLines + numberOfLinesIntersectingNodes;
  }, this));

  if (doReporting) {
    console.table(results);
  }

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
