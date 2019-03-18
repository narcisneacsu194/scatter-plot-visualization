ScatterPlot = function(_parentElement){
  this.parentElement = _parentElement;

  this.initVis();
};

ScatterPlot.prototype.initVis = function(){
  let vis = this;

  vis.margin = { left:80, right:20, top:150, bottom:100 };

  vis.width = 920 - vis.margin.left - vis.margin.right;
  vis.height = 630 - vis.margin.top - vis.margin.bottom;
    
  vis.svg = d3.select("#chart-area")
    .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

  vis.g = vis.svg.append("g")
    .attr("transform", "translate(" + vis.margin.left + ", " + vis.margin.top + ")");

  // Tooltip
  vis.tip = d3.tip().attr('class', 'd3-tip')
    .html(function(d) {
      let text = "<span style='color:white'>" + d.Name + ': ' + d.Nationality + "</span><br>";
      text += "<span style='color:white'>Year: " + d.Year + ', Time: ' + d.Time + "</span><br>";

      if(d.Doping !== '')
      text += "<br><span style='color:white'>" + d.Doping + "</span><br>";

      return text;
  });

  vis.g.call(vis.tip);

  // X Scale
  vis.x = d3.scaleTime()
    .domain([parseDate(1993), parseDate(2016)])
    .range([0, vis.width]);

  // Y Scale
  vis.y = d3.scaleTime()
    .domain(d3.extent(bikeRacingData, (d) => {
      return parseTime(d.Time);
    }))
    .range([0, vis.height]);

  vis.z = d3.scaleOrdinal(d3.schemeCategory10);

  // X Axis Call
  vis.xAxisCall = d3.axisBottom(vis.x)
    .ticks(12)
    .tickFormat(d3.timeFormat('%Y'));

  // Y Axis Call
  vis.yAxisCall = d3.axisLeft(vis.y)
    .tickFormat(d3.timeFormat('%M:%S'));

  vis.xAxisGroup = vis.g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + vis.height +")")
    .call(vis.xAxisCall);

  vis.yAxisGroup = vis.g.append("g")
    .attr("class", "y axis")
    .call(vis.yAxisCall);

  // Y Label
  vis.yLabel = vis.g.append("text")
    .attr("y", -60)
    .attr("x", -(vis.height / 3) + 40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Time in Minutes");

  // Graph title
  vis.svg.append('text')
    .attr('x', (vis.svg.attr('width') / 2))
    .attr('y', 50)
    .attr('font-size', '30px')
    .attr('text-anchor', 'middle')
    .text('Doping in Professional Bicycle Racing');

  // Graph sub-title
  vis.svg.append('text')
    .attr('x', (vis.svg.attr('width') / 2))
    .attr('y', 80)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text('35 Fastest times up Alpe d\'Huez');

  // Legend
  vis.typesOfBikers = [
    {
      dopingText: 'Riders with doping allegations',
      dopingBoolean: true
    },
    {
      dopingText: 'No doping allegations',
      dopingBoolean: false
    }
  ];

  vis.legend = vis.g.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + (vis.width) + ', ' + 
      (vis.height / 2) + ')')

  vis.typesOfBikers.forEach(function(type, index){
    let legendRow = vis.legend.append('g')
      .attr('transform', 'translate(0,' + (index * 20) + ')');
    legendRow.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', vis.z(type.dopingBoolean));
    legendRow.append('text')
      .attr('x', -10)
      .attr('y', 10)
      .attr('font-size', '10px')
      .attr('text-anchor', 'end')
      .text(type.dopingText);
  });

  vis.updateVis();
};

ScatterPlot.prototype.updateVis = function(){

  let vis = this;

  vis.g.selectAll("circle")
    .data(bikeRacingData)
    .enter()
    .append("circle")
    .attr("cx", function(d){ 
      return vis.x(parseDate(d.Year));
    })
    .attr("cy", function(d){
      return vis.y(parseTime(d.Time));
    })
    .attr("r", 6)
    .attr("fill", function(d){
      let doping;

      if(d.Doping === ""){
        doping = false;
      }else doping = true;

      return vis.z(doping);
    })
    .attr('stroke', '#000')
    .attr('style', 'opacity: 0.8')
    .on('mouseover', vis.tip.show)
    .on('mouseout', vis.tip.hide);
};
