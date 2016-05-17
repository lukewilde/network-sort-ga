var properties = require('../properties');
var _ = require('lodash');
var calculateDistance = require('euclidean-distance');

function Node(config, mate, game) {

  this.game = game;

  this.mutationRate = 0.001;

  this.config = config;

  this.name = config.name;
  this.connections = config.connections;

  this.width = 160;
  this.height = 120;

  if (mate) {
    this.x = this.getGene('x', mate);
    this.y = this.getGene('y', mate);
  } else {
    this.x = Math.round(Math.random() * (properties.size.x - this.width));
    this.y = Math.round(Math.random() * (properties.size.y - this.height));
  }

  this.centerX = this.x + (this.width / 2);
  this.centerY = this.y + (this.height / 2);

  this.clipRect = new Phaser.Rectangle(this.x, this.y, this.width, this.height);
}

Node.prototype.getGene = function(gene, mate) {
  var takeGeneFromMate = Math.random() > (0.5 - this.mutationRate / 2);
  var shouldMutateGene = Math.random() > 1 - this.mutationRate;

  if (takeGeneFromMate) {
    return mate[gene];
  } else if (shouldMutateGene) {
    return Math.round(Math.random() * (properties.size[gene] - this.width));
  } else {
    return this[gene];
  }
};

Node.prototype.draw = function() {
  this.drawBox();
  this.drawConnections();
};

Node.prototype.drawConnections = function() {

  var graphics = this.game.add.graphics(0, 0);
  graphics.beginFill(0xFF3300);
  graphics.lineStyle(3, 0xFFFFFF, 1);

  _.each(this.config.connections, _.bind(function(connection) {

    var connectingNode = _.find(this.otherNodes, { name: connection.target });

    // console.info('drawing line from ', connectingNode.centerX, connectingNode.centerY);
    graphics.moveTo(this.centerX, this.centerY);
    graphics.lineTo(connectingNode.centerX, connectingNode.centerY);

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

  return totalDistance;
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

  return currentLines;
};

Node.prototype.setConnections = function(allNodes) {

  this.otherNodes = _.reject(allNodes, { name: this.name });

  this.connectingLines = _.map(this.connections, _.bind(function(connection) {

    var connectingNode = _.find(this.otherNodes, { name: connection.target });
    var line = new Phaser.Line(this.centerX, this.centerY, connectingNode.centerX, connectingNode.centerY);
    line.name = connection.name;
    line.target = connection.target;
    return  line;
  }, this));
};

Node.prototype.drawBox = function() {
  // console.info('drawing box: ', this.name, this.x, this.y);

  var graphics = this.game.add.graphics(0, 0);

  graphics.beginFill(0xFF3300);
  graphics.lineStyle(10, 0xffd900, 1);
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
