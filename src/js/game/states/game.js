var game = {};
var evolution = require('../lib/evolution');
var reporting = require('../lib/reporting');
var properties = require('../properties');
var _ = require('lodash');

var populationSize = 100;
var numChaoticIterations = 10;

var maxChaoticGenerations = 30;
var maxPackingGenerations = 1000;
var maxGenerations = 0;

var currentChaoticIterations = 0;
var currentGeneration = 0;

var chaosFittest = [];

var fittest = null;
var networkToRender = null;

var CHAOTIC_EVOLUTION = 0;
var TRACK_FITTEST_FROM_CHAOS = 1;
var SELECTING = 2;
var EVOLVING = 3;
var REPORTING = 4;
var DONE = 5;
var DISPLAY_FITTEST = 6;

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

  if (numChaoticIterations < currentChaoticIterations) {
    currentState = SELECTING;
    return;
  }

  currentGeneration = 0;
  currentChaoticIterations ++;

  fittest = evolution.createInitialPopulation(populationSize, game, true);

  // Priming the first render.
  networkToRender = fittest;

  currentState = EVOLVING;
  nextState = TRACK_FITTEST_FROM_CHAOS;
  maxGenerations = maxChaoticGenerations;
}

function trackFittestFromChaos() {
  console.log('Overall winner from %s:%s:%s', currentChaoticIterations, fittest.generation, fittest.fitness);
  chaosFittest.push(fittest);
  currentState = CHAOTIC_EVOLUTION;
}

function chooseFittestFromAllChaos() {
  fittest = _.first(_.sortBy(chaosFittest, 'fitness'));
  console.log('creating new generation based on network with fitness %s', fittest.fitness);
  fittest = evolution.createPopulationFromIndividual(fittest);
  networkToRender = fittest;
  currentState = EVOLVING;
  maxGenerations = maxPackingGenerations;
  nextState = REPORTING;
}

function createNextGeneration() {
  networkToRender = evolution.nextGeneration(currentGeneration);

  if (fittest.fitness > networkToRender.fitness) {
    fittest = networkToRender;
  }

  // console.log('%s:%s', fittest.generation, fittest.fitness);

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
