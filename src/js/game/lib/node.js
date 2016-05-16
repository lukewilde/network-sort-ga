var properties = require('../properties');

function Node(config, game) {

  this.game = game;

  this.config = config;

  this.name = config.name;
  this.connections = config.connections;

  this.width = 160;
  this.height = 120;

  this.x = Math.round(Math.random() * (properties.size.x - this.width));
  this.y = Math.round(Math.random() * (properties.size.y - this.height));
}

Node.prototype.draw = function() {

  console.info('drawing box: ', this.name, this.x, this.y);

  var graphics = this.game.add.graphics(0, 0);

  // set a fill and line style
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

  var x = this.x + this.width / 2 - (fontSize / 2);
  var y = this.y + this.height / 2 - (fontSize / 2);

  this.game.add.text(x, y, this.name, style);
};

module.exports = Node;
