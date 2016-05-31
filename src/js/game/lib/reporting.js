module.exports = {
  showGraph: function(chartData, maxGenerations) {
    var data = window.google.visualization.arrayToDataTable(chartData);

    var options = {
      title: 'Generation vs. Fitness comparison',
      hAxis: { title: 'Generation', minValue: 0, maxValue: maxGenerations },
      vAxis: { title: 'Fitness', minValue: 0, maxValue: 50000 },
      legend: 'none',
      pointSize: 1,
      trendlines: {
        0: {
          color: 'red',
          opacity: 0.5,
          degree: 3,
          lineWidth: 5,
          type: 'polynomial'
        }
      }
    };

    var chartDiv = document.getElementById('chart');
    var chartContainer = document.getElementById('chart-container');


    var chart = new window.google.visualization.ScatterChart(chartDiv);

    var showButton = document.getElementsByClassName('show-button');

    chartContainer.style.display = 'block';
    var graphOpen = true;

    showButton[0].addEventListener('click', function() {
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
