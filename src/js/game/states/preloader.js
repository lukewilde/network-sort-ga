var preloader = {};
var _ = require('lodash');
var properties = require('../properties');

preloader.create = function () {

  if (properties.disableCharts) {
    this.game.state.start('game');
    return;
  }

  window.google.charts.load('current', {'packages':['corechart']});
  window.google.charts.setOnLoadCallback(_.bind(function() {
    this.game.state.start('game');
  }, this));
};

module.exports = preloader;
