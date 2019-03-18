let bikeRacingData;
let scatterPlot;
let parseTime = d3.timeParse('%M:%S');
let formatTime = d3.timeFormat('%M:%S');
let parseDate = d3.timeParse('%Y');
let formatDate = d3.timeFormat('%Y');

d3.json("data/bike_racing_data.json").then(function(data){
  bikeRacingData = data;

  scatterPlot = new ScatterPlot();
}).catch(error => console.log(error));



