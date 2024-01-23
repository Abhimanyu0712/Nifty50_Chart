google.charts.load('current', { 'packages': ['corechart'] });

google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Date');
    data.addColumn('number', 'Open');
    data.addColumn('number', 'High');
    data.addColumn('number', 'Low');
    data.addColumn('number', 'Close');
    // Retrieve historical Nifty50 data for the last 13 years
    fetch('https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=TBD20U8QYNWEXL3K')
    .then(response => response.json())
    .then(apiData => {
      // Extract the time series data
      const monthlyTimeSeries = apiData['Monthly Time Series'];

      // Convert the time series data to an array of objects
      const dataArray = Object.entries(monthlyTimeSeries).map(([date, values]) => {
        return {
          date: new Date(date),
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close'])
        };
      });

      // Filter data if needed (e.g., include only records until 2015)
      const dataFrom2015 = dataArray.filter(item => item.date.getFullYear() >= 2015);

      // Format data for Candlestick Chart
      const nifty50Data = dataFrom2015.map(item => [
        item.date,
        item.open,
        item.high,
        item.low,
        item.close
      ]);
    //  ANOTHER API
    // fetch('https://api.iex.cloud/v1/data/core/historical_prices/spy?range=18y&token=pk_79d82706903145e1a8863303bb8c5a19')
    // .then(response => response.json())
    // .then(data => {
    //   // Filter data to include only records until 2015
    //   const dataUntil2015 = data.filter(item => new Date(item.priceDate).getFullYear() <= 2015);

    //   // Format data for Candlestick Chart
    //   const formattedData = dataUntil2015.map(item => [
    //     new Date(item.priceDate),
    //     item.fopen,
    //     item.fhigh,
    //     item.flow,
    //     item.fclose
    //   ]);
      data.addRows(nifty50Data);
  
        // Set chart options
        var options = {
            title : 'Nifty50 yearly data',
            // tooltip: { isHtml: true },
            'width':'100%', 'height':450,
            vAxis: {title: 'Value'},
            hAxis: {
          title: 'Date',
          format: 'yyyy' // Display only the year on the X-axis
        },
            legend: 'none',
            candlestick: {
              fallingColor: { strokeWidth: 0, fill: '#FF0000' },
              risingColor: { strokeWidth: 0, fill: 'green' },
            },
            backgroundColor: {
                fill: '#FAF9F6',
                fillOpacity: 0.8
              },
            colors: ['blue']
          };
  
          var chart = new google.visualization.CandlestickChart(document.getElementById('candlestick_chart'));
          chart.draw(data, options);
          window.addEventListener('resize', function () {
            chart.draw(data, options);
          });
      });
  }