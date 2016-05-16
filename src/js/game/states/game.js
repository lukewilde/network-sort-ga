var game = {};
var nodeManager = require('../lib/node-manager');
var smallNetwork = require('../graphs/small');

game.create = function () {
  nodeManager.init(smallNetwork, this.game);
  nodeManager.draw(smallNetwork);
};

module.exports = game;
