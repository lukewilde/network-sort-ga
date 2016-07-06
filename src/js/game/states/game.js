var game = {};
var evolution = require('../lib/evolution');
var reporting = require('../lib/reporting');
var properties = require('../properties');

var populationSize = 50;
var maxIslandSpecies = 10;

var maxIslandGenerations = 100;
var maxMainlandGenerations = 500;

var currentIslandIterations = 0;
var currentGeneration = 0;

var fittestFromIslands = [];

var fittest = null;
var networkToRender = null;

var CREATE_ISLAND_SPECIES = 0;
var TRACK_FITTEST_FROM_ISLANDS = 1;
var CHOOSE_FITTEST_FROM_ISLANDS = 2;
var EVOLVE_ISLANDS = 3;
var EVOLVE_MAINLAND = 4;
var REPORTING = 5;
var DONE = 6;
var DISPLAY_FITTEST = 7;

var currentState = CREATE_ISLAND_SPECIES;

game.create = function() {
  reporting.setupEvents();
};

game.update = function() {
  switch (currentState) {
  case CREATE_ISLAND_SPECIES:
    createIslandSpecies();
    break;
  case TRACK_FITTEST_FROM_ISLANDS:
    addToFittestFromIslands();
    break;
  case CHOOSE_FITTEST_FROM_ISLANDS:
    chooseFittestFromIslands();
    break;
  case EVOLVE_ISLANDS:
    createNextIslandGeneration();
    break;
  case EVOLVE_MAINLAND:
    createNextMainlandGeneration();
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

function createIslandSpecies() {

  if (maxIslandSpecies < currentIslandIterations) {
    currentState = CHOOSE_FITTEST_FROM_ISLANDS;
    return;
  }

  currentGeneration = 0;
  currentIslandIterations ++;

  fittest = evolution.createInitialPopulation(populationSize, game, true);

  reporting.addToIslandSeries(currentGeneration, fittest);

  // Priming the first render.
  networkToRender = fittest;

  currentState = EVOLVE_ISLANDS;
}

function addToFittestFromIslands() {
  console.log('Overall winner from %s:%s:%s', currentIslandIterations, fittest.generation, fittest.fitness);
  fittestFromIslands.push(fittest);
  currentState = CREATE_ISLAND_SPECIES;
}

function chooseFittestFromIslands() {

  currentGeneration = 0;

  fittest = evolution.createPopulationFromSelection(fittestFromIslands, fittest.fitness);
  console.log('creating new generation based on networks with fitness %s', fittest.fitness);

  networkToRender = fittest;
  currentState = EVOLVE_MAINLAND;
}

function createNextIslandGeneration() {
  networkToRender = createNextGeneration(maxIslandGenerations, TRACK_FITTEST_FROM_ISLANDS);
  reporting.addToIslandSeries(currentGeneration, networkToRender);
}

function createNextMainlandGeneration() {
  networkToRender = createNextGeneration(maxMainlandGenerations, REPORTING);
  reporting.addToMainlandSeries(currentGeneration, networkToRender);
}

function createNextGeneration(maxGenerations, nextState) {
  var generation = evolution.nextGeneration(currentGeneration);

  if (fittest.fitness > generation.fitness) {
    fittest = generation;
  }

  currentGeneration ++;

  if (currentGeneration >= maxGenerations - 1) {
    currentState = nextState;
  }

  return generation;
}

function report() {

  fittest.reportFitness();

  console.log('Winner: %s from generation %s', fittest.fitness, fittest.generation);

  networkToRender = fittest;

  if (!properties.disableCharts) {
    reporting.showGraphs();
  }

  currentState = DISPLAY_FITTEST;
}

module.exports = game;
