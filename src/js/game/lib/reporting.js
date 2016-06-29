module.exports = {

  islandSeries: [['Generation', 'Fitness']],

  mainSeries: [['Generation', 'Fitness']],

  addToIslandSeries: function(generation, fittestNetwork) {
    this.islandSeries.push([generation, fittestNetwork.fitness]);
  },

  addToMainSeries: function(generation, fittestNetwork) {
    this.mainSeries.push([generation, fittestNetwork.fitness]);
  },

  showGraph: function() {
    var data = window.google.visualization.arrayToDataTable(this.islandSeries);

    var options = {
      title: 'Generation vs. Fitness comparison',
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
    };

    var chartDiv = document.getElementById('island');
    var chartContainer = document.getElementById('chart-container');
    var chart = new window.google.visualization.ScatterChart(chartDiv);
    var showButton = document.getElementsByClassName('show-island')[0];

    chartContainer.style.display = 'block';
    var graphOpen = true;

    showButton.addEventListener('click', function() {
      if (graphOpen) {
        chartContainer.style.left = '-800px';
      } else {
        chartContainer.style.left = '0px';
      }

      graphOpen = !graphOpen;
    }, false);

    chart.draw(data, options);
  }
};
