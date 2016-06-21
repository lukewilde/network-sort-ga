var game = {};
var evolution = require('../lib/evolution');
var reporting = require('../lib/reporting');
var properties = require('../properties');
var populationSize = 100;
var maxChaoticGenerations = 10;
var numChaoticIterations = 30;
var maxPackingGenerations = 1000;
var maxGenerations = 0;
var currentGeneration = 0;

var fittest = null;
var networkToRender = null;

var CHAOTIC_EVOLUTION = 0;
var SELECTING = 1;
var PACKING = 2;
var EVOLVING = 3;
var REPORTING = 4;
var DONE = 5;
var DISPLAY_FITTEST = 6;

var currentState = CHAOTIC_EVOLUTION;

game.update = function() {
  switch (currentState) {
  case CHAOTIC_EVOLUTION:
    evolveWithChaos();
    break;
  case SELECTING:
    chooseFittestFromAllGenerations();
    break;
  case PACKING:
    pack();
    break;
  case EVOLVING:
    createNextGeneration();
    break;
  case REPORTING:
    report();
    break;
  case DISPLAY_FITTEST:
    break;
  case DONE:
    break;
  default:
    console.warn('In unknown state %s', currentState);
  }
};

game.render = function() {
  if (currentState === DONE) {
    return;
  }
  // Destroy all old graphics.
  game.world.removeAll();
  networkToRender.draw();

  if (currentState === DISPLAY_FITTEST) {
    currentState = DONE;
  }
};

function evolveWithChaos() {
  fittest = evolution.createInitialPopulation(populationSize, game, true);
  currentState = EVOLVING;
  maxGenerations = maxChaoticGenerations;
}

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
  if (!properties.disableCharts) {
    reporting.showGraph(evolution.chartData, maxGenerations);
  }
  currentState = DISPLAY_FITTEST;
}

module.exports = game;
