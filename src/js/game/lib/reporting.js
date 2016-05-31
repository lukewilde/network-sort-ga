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

    var chartDiv = document.getElementById('chart-div');
    chartDiv.style.display = 'block';

    var chart = new window.google.visualization.ScatterChart(chartDiv);

    chart.draw(data, options);
  }
};
