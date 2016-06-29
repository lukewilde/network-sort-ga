var game = {};
var evolution = require('../lib/evolution');
var reporting = require('../lib/reporting');
var properties = require('../properties');

var populationSize = 50;
var maxIslandSpecies = 10;

var maxIslandGenerations = 30;
var maxMainlandGenerations = 500;
var maxGenerations = 0;

var currentIslandIterations = 0;
var currentGeneration = 0;

var fittestFromIslands = [];

var fittest = null;
var networkToRender = null;

var CREATE_ISLAND_SPECIES = 0;
var TRACK_FITTEST_FROM_ISLANDS = 1;
var CHOOSE_FITTEST_FROM_ISLANDS = 2;
var EVOLVING = 3;
var REPORTING = 4;
var DONE = 5;
var DISPLAY_FITTEST = 6;

var nextState = null;
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

  currentState = EVOLVING;
  nextState = TRACK_FITTEST_FROM_ISLANDS;
  maxGenerations = maxIslandGenerations;
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

  // This is necessary because after chaos we increase fitness by the path distance.
  fittest.fitness = Infinity;

  networkToRender = fittest;
  currentState = EVOLVING;
  maxGenerations = maxMainlandGenerations;
  nextState = REPORTING;
}

function createNextGeneration() {
  networkToRender = evolution.nextGeneration(currentGeneration);

  if (nextState === TRACK_FITTEST_FROM_ISLANDS) {
    reporting.addToIslandSeries(currentGeneration, networkToRender);
  } else {
    reporting.addToMainlandSeries(currentGeneration, networkToRender);
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
    reporting.showGraphs();
  }

  currentState = DISPLAY_FITTEST;
}

module.exports = game;
