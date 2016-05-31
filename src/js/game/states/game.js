var game = {};
var evolve = require('../lib/evolve');
var populationSize = 100;
var maxGenerations = 100;
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
  var data = window.google.visualization.arrayToDataTable(evolve.chartData);

  var options = {
    title: 'Generation vs. Fitness comparison',
    hAxis: { title: 'Generation', minValue: 0, maxValue: maxGenerations },
    vAxis: { title: 'Fitness', minValue: 0, maxValue: 50000 },
    legend: 'none',
    pointSize: 1,
    trendlines: {
      0: {
        color: 'red',
        opacity: 0.5,
        degree: 3,
        lineWidth: 5,
        type: 'polynomial'
      }
    }
  };

  var chartDiv = document.getElementById('chart-div');
  chartDiv.style.display = 'block';

  var chart = new window.google.visualization.ScatterChart(chartDiv);

  chart.draw(data, options);
}

module.exports = game;
