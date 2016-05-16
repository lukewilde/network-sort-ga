var game = {};
var network = require('../lib/network');
var smallNetwork = require('../graphs/small');

game.create = function () {
  network.init(smallNetwork, this.game);
  network.draw(smallNetwork);
};

module.exports = game;
