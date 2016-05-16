var properties = require('../properties');
var _ = require('lodash');

function Node(config, otherNodes, game) {

  this.game = game;

  this.config = config;
  this.otherNodes = otherNodes;

  this.name = config.name;
  this.connections = config.connections;

  this.width = 160;
  this.height = 120;

  this.x = Math.round(Math.random() * (properties.size.x - this.width));
  this.y = Math.round(Math.random() * (properties.size.y - this.height));

  this.centerX = this.x + (this.width / 2);
  this.centerY = this.y + (this.height / 2);
}

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

    console.info('drawing line from ', connectingNode.centerX, connectingNode.centerY);
    graphics.moveTo(this.centerX, this.centerY);
    graphics.lineTo(connectingNode.centerX, connectingNode.centerY);
    graphics.endFill();
  }, this));
};

Node.prototype.drawBox = function() {
  console.info('drawing box: ', this.name, this.x, this.y);

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
