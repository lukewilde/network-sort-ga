var properties = require('../properties');
var _ = require('lodash');
var calculateDistance = require('euclidean-distance');
var md5 = require('md5');

function Node(config, mother, father, game) {

  this.game = game;

  this.mutationRate = 0.001;
  this.maxMutationMagnitude = 0.2;

  this.config = config;

  this.name = config.name;
  this.connections = config.connections;

  this.width = 160;
  this.height = 120;

  var hash = md5(this.name).substring(0, 6);
  var colourCode = parseInt(hash, 16);

  this.colour = parseInt(colourCode);

  this.numberOfConnections = 0;

  if (mother && father) {
    this.x = this.inheritGene('x', mother, father);
    this.y = this.inheritGene('y', mother, father);
  } else {
    this.x = Math.round(Math.random() * (properties.size.x - this.width));
    this.y = Math.round(Math.random() * (properties.size.y - this.height));
  }

  this.genotype = this.getGenotype();

  this.centerX = this.x + (this.width / 2);
  this.centerY = this.y + (this.height / 2);

  this.clipRect = new Phaser.Rectangle(this.x, this.y, this.width, this.height);

  var bottomLeft = this.clipRect.bottomLeft;
  var bottomRight = this.clipRect.bottomRight;
  var topRight = this.clipRect.topRight;
  var topLeft = this.clipRect.topLeft;

  this.edges = [
    new Phaser.Line(bottomLeft.x, bottomLeft.y, topLeft.x, topLeft.y),
    new Phaser.Line(topLeft.x, topLeft.y, topRight.x, topRight.y),
    new Phaser.Line(topRight.x, topRight.y, bottomRight.x, bottomRight.y),
    new Phaser.Line(bottomRight.x, bottomRight.y, bottomLeft.x, bottomLeft.y),
  ];
}

Node.prototype.inheritGene = function(gene, mother, father) {
  var takeGeneFromMother = Math.random() > (0.5 - this.mutationRate / 2);
  var shouldMutateGene = Math.random() > 1 - this.mutationRate;

  if (takeGeneFromMother) {
    return mother.getGene(gene);
  } else if (shouldMutateGene) {
    return mother.getGene(gene) * _.random(0, this.maxMutationMagnitude);
  } else {
    return father[gene];
  }
};

Node.prototype.getGene = function(gene) {
  return this[gene];
};

Node.prototype.getGenotype = function() {
  return JSON.stringify({
      name: this.name,
      x: this.x,
      y: this.y
    });
};

Node.prototype.draw = function() {
  this.drawBox();
  this.drawConnections();
};

Node.prototype.drawConnections = function() {

  var graphics = this.game.add.graphics(0, 0);
  graphics.beginFill(this.colour);
  graphics.lineStyle(3, this.colour, 1);

  _.each(this.config.connections, _.bind(function(connection) {

    var connectingNode = _.find(this.otherNodes, { name: connection.target });

    // console.info('drawing line from ', connectingNode.centerX, connectingNode.centerY);
    graphics.moveTo(this.centerX, this.centerY);
    graphics.lineTo(connectingNode.centerX, connectingNode.centerY);

    this.numberOfConnections ++;
    connectingNode.numberOfConnections ++;

    graphics.endFill();

  }, this));
};

Node.prototype.getConnectionDistance = function() {

  var totalDistance = 0;

  _.each(this.config.connections, _.bind(function(connection) {

    var connectingNode = _.find(this.otherNodes, { name: connection.target });

    var thisNode = [this.centerX, this.centerY];
    var targetNode = [connectingNode.centerX, connectingNode.centerY];
    totalDistance += calculateDistance(thisNode, targetNode);
  }, this));

  return Math.round(totalDistance);
};

Node.prototype.getAreaOfOverlappingNodes = function() {

  var areaOfOverlappingNodes = 0;

  _.each(this.otherNodes, _.bind(function(node) {
    var intersection = this.clipRect.intersection(node.clipRect);
    var intersectionArea = intersection.width && intersection.height;
    areaOfOverlappingNodes += intersectionArea;

  }, this));

  return areaOfOverlappingNodes;

};

/**
 * This counts intersections incorrectly. lines will collide with all other
 * lines which connect both the source and the target node. This doesn't matter
 * however, as these will remain consistent no matter how the network evolves.
 *
 * Unless they then ignore collisions with these lines.
 */
Node.prototype.getNumberOfIntersectingLines = function() {

  var currentLines = 0;

  _.each(this.otherNodes, _.bind(function(node) {
    _.each(node.connectingLines, _.bind(function(otherLine) {
      _.each(this.connectingLines, function(line) {
          if (line.intersects(otherLine)) {
            currentLines ++;
          }
      });
    }, this));
  }, this));

  return currentLines - this.numberOfConnections;
};

Node.prototype.getNumberOfLineNodeIntersects = function() {

  var total = 0;

  _.each(this.otherNodes, _.bind(function(node) {
    _.each(this.connectingLines, function(line) {
      _.each(node.edges, function(edge) {
        if (edge.intersects(line)) {
          total ++;
        }
      });
    });
  }, this));

  return total;
};

Node.prototype.setConnections = function(allNodes) {

  this.otherNodes = _.reject(allNodes, { name: this.name });
  this.connectingNodes = [];

  this.connectingLines = _.map(this.connections, _.bind(function(connection) {

    var connectingNode = _.find(this.otherNodes, { name: connection.target });

    this.connectingNodes.push(connectingNode);

    var line = new Phaser.Line(this.centerX, this.centerY, connectingNode.centerX, connectingNode.centerY);
    line.name = connection.name;
    line.target = connection.target;
    return  line;
  }, this));
};

Node.prototype.drawBox = function() {
  // console.info('drawing box: ', this.name, this.x, this.y);

  var graphics = this.game.add.graphics(0, 0);

  graphics.beginFill(this.colour);
  graphics.drawRect(this.x, this.y, this.width, this.height);

  var fontSize = 52;

  var style = {
    font: fontSize + 'px Arial',
    fill: 'black',
    wordWrap: true,
    wordWrapWidth: this.width,
    align: 'center',
  };

  var x = this.x + this.width / 1.78 - (fontSize / 2);
  var y = this.y + this.height / 2 - (fontSize / 2);

  this.game.add.text(x, y, this.name, style);
};



module.exports = Node;
