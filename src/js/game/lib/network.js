var _ = require('lodash');
var Item = require('./item');

function Network(config, game) {
  this.nodes = [];
  this.config = config;
  this.game = game;

  this.sizeWeighting = 1;

  this.intersectionWeighting = 10;

  this.weighting = {
    size: 1,
    area: 5,
    lines: 30,
    intersect: 100,
    outOfBounds: 3000,
  };
}

Network.prototype.getFirstGeneration = function() {
  _.each(this.config, _.bind(function(nodeConfig) {
    this.nodes.push(new Item(nodeConfig, null, this.game));
  }, this));

  this.connectNodes();
};

Network.prototype.connectNodes = function() {
  _.each(this.nodes, _.bind(function (node) {
    node.setConnections(this.nodes);
  }, this));

  this.genotype = this.getGenotype();

  this.fitness = this.getFitness();
  this.normalisedFitness = 0;
};

Network.prototype.mutate = function() {
  var child = new Network(this.config, this.game);

  _.each(this.nodes, _.bind(function(node) {
    child.nodes.push(new Item(node.config, node, this.game));
  }, this));

  child.connectNodes(child.nodes);
  return child;
};

Network.prototype.getGenotype = function() {
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

    var outOfBounds = 0;

    if (node.isOutOfBounds()) {
      outOfBounds = 1 * this.weighting.outOfBounds;
    }

    if (doReporting) {
      results.push({
        name: node.name,
        size: size,
        areaOfOverlappingNodes: areaOfOverlappingNodes,
        numberOfOverlappingLines: numberOfOverlappingLines,
        outOfBounds: outOfBounds,
        numberOfLinesIntersectingNodes: numberOfLinesIntersectingNodes
      });
    }

    fitness += size + outOfBounds + areaOfOverlappingNodes + numberOfOverlappingLines + numberOfLinesIntersectingNodes;
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
