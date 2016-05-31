var game = {};
var evolution = require('../lib/evolution');
var reporting = require('../lib/reporting');
var populationSize = 50;
var maxGenerations = 1000;
var currentGeneration = 0;

var fittest = null;
var networkToRender = null;

var EVOLVING = 0;
var REPORTING = 1;
var DONE = 2;

var currentState = EVOLVING;

game.create = function () {
  fittest = evolution.createInitialPopulation(populationSize, game);
};

game.update = function() {
  switch (currentState) {
  case EVOLVING:
    createNextGeneration();
    break;
  case REPORTING:
    report();
    break;
  case DONE:
    break;
  default:
    console.warn('In unknown state %s', currentState);
  }
};

game.render = function() {
  // Destroy all old graphics.
  game.world.removeAll();
  networkToRender.draw();
};

function createNextGeneration() {
  networkToRender = evolution.nextGeneration(currentGeneration);

  console.log('Generation %s: %s', currentGeneration, networkToRender.fitness);

  if (fittest.fitness > networkToRender.fitness) {
    fittest = networkToRender;
  }

  checkIfMaxGenerations();
}

function checkIfMaxGenerations() {
  currentGeneration ++;

  if (currentGeneration >= maxGenerations) {
    currentState = REPORTING;
  }
}

function report() {
  fittest.reportFitness();
  console.log('Winner: %s from generation %s', fittest.fitness, fittest.generation);
  networkToRender = fittest;
  reporting.showGraph(evolution.chartData, maxGenerations);
  currentState = DONE;
}

module.exports = game;
