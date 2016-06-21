var game = {};
var evolution = require('../lib/evolution');
var reporting = require('../lib/reporting');
var properties = require('../properties');
var _ = require('lodash');
var populationSize = 100;
var maxChaoticGenerations = 10;
var numChaoticIterations = 30;
var currentChaoticIterations = 0;
var maxPackingGenerations = 1000;
var maxGenerations = 0;
var currentGeneration = 0;

var chaosFittest = [];

var fittest = null;
var networkToRender = null;

var CHAOTIC_EVOLUTION = 0;
var TRACK_FITTEST_FROM_CHAOS = 1;
var SELECTING = 2;
var PACKING = 3;
var EVOLVING = 4;
var REPORTING = 5;
var DONE = 6;
var DISPLAY_FITTEST = 7;

var nextState = null;
var currentState = CHAOTIC_EVOLUTION;

game.update = function() {
  switch (currentState) {
  case CHAOTIC_EVOLUTION:
    evolveWithChaos();
    break;
  case TRACK_FITTEST_FROM_CHAOS:
    trackFittestFromChaos();
    break;
  case SELECTING:
    chooseFittestFromAllChaos();
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

  if (numChaoticIterations >= currentChaoticIterations) {
    currentState = SELECTING;
    return;
  }

  currentChaoticIterations ++;

  fittest = evolution.createInitialPopulation(populationSize, game, true);
  currentState = EVOLVING;
  nextState = TRACK_FITTEST_FROM_CHAOS;
  maxGenerations = maxChaoticGenerations;
}

function trackFittestFromChaos() {
  chaosFittest.push(fittest);
  currentState = CHAOTIC_EVOLUTION;
}

function chooseFittestFromAllChaos() {
  fittest = _.first(_.sortBy(chaosFittest, 'fitness'));
  currentState = REPORTING;
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
    currentState = nextState;
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
