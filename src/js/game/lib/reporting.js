module.exports = {

  series: {
    island: [['Generation', 'Fitness']],
    mainland: [['Generation', 'Fitness']],
  },

  chartContainer: null,

  options: {
    hAxis: { title: 'Generation' },
    vAxis: { title: 'Fitness' },
    legend: 'none',
    pointSize: 1,
    trendlines: {
      0: {
        color: 'red',
        opacity: 0.5,
        degree: 3,
        lineWidth: 5,
        type: 'polynomial',
        tooltip: false
      }
    }
  },

  addToIslandSeries: function(generation, fittestNetwork) {
    this.series.island.push([generation, fittestNetwork.fitness]);
  },

  addToMainlandSeries: function(generation, fittestNetwork) {
    this.series.mainland.push([generation, fittestNetwork.fitness]);
  },

  setupEvents: function() {
    var chartContainer = document.getElementById('chart-container');
    var showButton = document.getElementsByClassName('show-hide-button')[0];
    var graphOpen = true;

    showButton.addEventListener('click', function() {
      if (graphOpen) {
        chartContainer.style.left = '-800px';
      } else {
        chartContainer.style.left = '0px';
      }

      graphOpen = !graphOpen;
    }, false);

    this.chartContainer = chartContainer;
  },

  showGraphs: function() {
    this.chartContainer.style.display = 'block';
    this.showGraph('island');
    this.showGraph('mainland');
  },

  showGraph: function(series) {

    if (series === 'island') {
      this.options.title = 'Island Series Fitness';
    } else {
      this.options.title = 'Mainland Series Fitness';
    }

    var chartDiv = document.getElementById(series);
    var chart = new window.google.visualization.ScatterChart(chartDiv);
    var data = window.google.visualization.arrayToDataTable(this.series[series]);

    chart.draw(data, this.options);
  }
};
