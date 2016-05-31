var preloader = {};
var _ = require('lodash');

preloader.create = function () {
  window.google.charts.load('current', {'packages':['corechart']});
  window.google.charts.setOnLoadCallback(_.bind(function() {
    this.game.state.start('game');
  }, this));
};

module.exports = preloader;
