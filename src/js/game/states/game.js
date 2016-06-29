var game = {};
var evolution = require('../lib/evolution');
var reporting = require('../lib/reporting');
var properties = require('../properties');

var populationSize = 100;
var numChaoticSpecies = 1;

var maxChaoticGenerations = 1;
var maxPackingGenerations = 1;
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

  if (numChaoticSpecies < currentChaoticIterations) {
    currentState = SELECTING;
    return;
  }

  currentGeneration = 0;
  currentChaoticIterations ++;

  fittest = evolution.createInitialPopulation(populationSize, game, true);

  reporting.addToIslandSeries(currentGeneration, fittest);

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

  fittest = evolution.createPopulationFromSelection(chaosFittest, fittest.fitness);
  console.log('creating new generation based on networks with fitness %s', fittest.fitness);

  reporting.addToMainSeries(0, fittest);

  // This is necessary because after chaos we increase fitness by the path distance.
  fittest.fitness = Infinity;

  networkToRender = fittest;
  currentState = EVOLVING;
  maxGenerations = maxPackingGenerations;
  nextState = REPORTING;
}

function createNextGeneration() {
  networkToRender = evolution.nextGeneration(currentGeneration);

  if (nextState === TRACK_FITTEST_FROM_CHAOS) {
    reporting.addToIslandSeries(currentGeneration, networkToRender);
  } else {
    reporting.addToMainSeries(currentGeneration, networkToRender);
  }

  if (fittest.fitness > networkToRender.fitness) {
    fittest = networkToRender;
  }

  checkIfMaxGenerations();
}

function checkIfMaxGenerations() {
  currentGeneration ++;

  if (currentGeneration >= maxGenerations - 1) {
    currentState = nextState;
  }
}

function report() {

  fittest.reportFitness();

  console.log('Winner: %s from generation %s', fittest.fitness, fittest.generation);

  networkToRender = fittest;

  if (!properties.disableCharts) {
    reporting.showGraph();
  }

  currentState = DISPLAY_FITTEST;
}

module.exports = game;
