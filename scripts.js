var data = {"MASCULINO": {"4": 0, "2": 824}, "FEMININO": {"4": 372, "2": 0}};
var xData = ["fem", "mas"];

var margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .35);

var y = d3.scale.linear()
        .rangeRound([height, 0]);

var color = d3.scale.ordinal().range(['#2B3A67', '#E84855']);

var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
        
var svg = d3.select("#genero svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    

var feminino = data["FEMININO"][4];
var masculino = data["MASCULINO"][2];
var total = feminino + masculino;
var jTotal = [{ graph: "gender" , fem: feminino, mas: masculino }];

var dataIntermediate=['mas','fem'].map(function(key,i){
    return jTotal.map(function(d,j){
        return {x: d['graph'], y: d[key] };
    })
})

var dataStackLayout = d3.layout.stack()(dataIntermediate);
 
x.domain(dataStackLayout[0].map(function (d) {
    return d.x;
}));
 
y.domain([0,
    d3.max(dataStackLayout[dataStackLayout.length - 1],
            function (d) { return d.y0 + d.y;})
    ])
  .nice();
 
var layer = svg.selectAll(".stack")
    .data(dataStackLayout)
    .enter().append("g")
    .attr("class", "stack")
    .style("fill", function (d, i) {
        return color(i);
    });
 
layer.selectAll("rect")
    .data(function (d) {
        return d;
    })
    .enter().append("rect")
    .attr("x", function (d) {
        return x(d.x);
    })
    .attr("y", function (d) {
        return y(d.y + d.y0);
    })
    .attr("height", function (d) {
        return y(d.y0) - y(d.y + d.y0);
    })
    .attr("width", x.rangeBand());
 
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

