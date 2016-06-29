var _ = require('lodash');
var Node = require('./node');

function Network(config, game, rapidMutation) {
  this.nodes = [];
  this.config = config;
  this.game = game;
  this.rapidMutation = rapidMutation;

  // This means about 10% - 20% of the population will incur a node swap.
  this.swapChance = 2 / config.length;

  this.weighting = {
    size: 1,
    area: 10,
    lines: 100,
    intersect: 200,
    outOfBounds: 6000,
  };

  // We don't want to shrink the network initially, this ease reorganising the items.
  if (this.rapidMutation) {
    this.weighting.size = 0;
  }
}

Network.prototype.getFirstGeneration = function() {
  _.each(this.config, _.bind(function(nodeConfig) {
    this.nodes.push(new Node(nodeConfig, null, this.game, this.rapidMutation));
  }, this));

  this.connectNodes();
};

Network.prototype.connectNodes = function() {
  _.each(this.nodes, _.bind(function (node) {
    node.setConnections(this.nodes);
  }, this));

  this.genotype = this.getGenotype();
  this.fitness = this.getFitness();
};

Network.prototype.mutate = function() {
  var child = new Network(this.config, this.game, this.rapidMutation);

  _.each(this.nodes, _.bind(function(node) {
    child.nodes.push(new Node(node.config, node, this.game, this.rapidMutation));
  }, this));

  child.swapSomeNodes();

  child.connectNodes(child.nodes);
  return child;
};

Network.prototype.swapSomeNodes = function() {

  if (Math.random() < this.swapChance) {
    var a = _.sample(this.nodes);
    var b = _.sample(this.nodes);

    var tempPosition = {
      x: b.x,
      y: b.y
    };

    b.setPosition(a.x, a.y);
    a.setPosition(tempPosition.x, tempPosition.y);
  }

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

  this.drawStats();
};

Network.prototype.drawStats = function() {
  var textStyle = {
    fill: 'red',
    fontSize: '22px'
  };

  this.game.add.text(40, 20, 'Generation:' + this.generation, textStyle);
  this.game.add.text(40, 45, 'Fitness:' + this.fitness, textStyle);
};

module.exports = Network;
