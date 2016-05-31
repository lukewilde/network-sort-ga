var game = {};
var evolve = require('../lib/evolve');
var populationSize = 100;
var maxGenerations = 200;
var currentGeneration = 0;

var fittest = null;
var fittestFromGeneration = null;
var reported = false;

game.create = function () {
  fittest = evolve.createInitialPopulation(populationSize, game);
};

game.update = function() {

  var done = currentGeneration >= maxGenerations;

  if (done && !reported) {
    fittest.reportFitness();
    console.log('Winner: %s from generation', fittest.fitness, fittest.generation);
    reported = true;
    fittestFromGeneration = fittest;
    showGraph();
    return;
  } else if (done) {
    return;
  }

  if (!done) {

    fittestFromGeneration = evolve.nextGeneration(currentGeneration);
    currentGeneration ++;

    console.log('Generation %s: %s', currentGeneration, fittestFromGeneration.fitness);

    if (fittest.fitness > fittestFromGeneration.fitness) {
      fittest = fittestFromGeneration;
    }
  }

};

game.render = function() {
  // Destroy all old graphics.
  game.world.removeAll();
  fittestFromGeneration.draw();
};

function showGraph() {

  window.google.charts.load('current', {'packages':['corechart']});
  window.google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var data = window.google.visualization.arrayToDataTable(evolve.chartData);

    var options = {
      title: 'Age vs. Weight comparison',
      hAxis: {title: 'Age', minValue: 0, maxValue: 15},
      vAxis: {title: 'Weight', minValue: 0, maxValue: 15},
      legend: 'none'
    };

    var chartDiv = document.getElementById('chart-div');
    chartDiv.style.display = 'block';

    var chart = new window.google.visualization.ScatterChart(chartDiv);

    chart.draw(data, options);
  }
}

module.exports = game;
