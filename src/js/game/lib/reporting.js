module.exports = {

  series: {
    island: [['Generation', 'Fitness']],
    main: [['Generation', 'Fitness']],
  },

  addToIslandSeries: function(generation, fittestNetwork) {
    this.series.island.push([generation, fittestNetwork.fitness]);
  },

  addToMainlandSeries: function(generation, fittestNetwork) {
    this.series.main.push([generation, fittestNetwork.fitness]);
  },

  setupEvents: function() {
    var chartContainer = document.getElementById('chart-container');
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
  },

  showGraph: function(series) {

    var title = '';

    if (series === 'island') {
      title = 'Island Series Fitness';
    } else {
      title = 'Mainland Series Fitness';
    }

    var options = {
      title: title,
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

    var chartDiv = document.getElementById(series);
    var chart = new window.google.visualization.ScatterChart(chartDiv);
    var data = window.google.visualization.arrayToDataTable(this.series[series]);

    chart.draw(data, options);
  }
};
