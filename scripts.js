var treatData = function(rawData){
    //var data = {"MASCULINO": {"4": 0, "2": 824}, "FEMININO": {"4": 372, "2": 0}};    

    var feminino = rawData["FEMININO"];
    var masculino = rawData["MASCULINO"];
    var naoInformado = rawData["NÃO INFORMADO"] ? rawData["NÃO INFORMADO"] : 0;
    
    var total = feminino + masculino;
    var jTotal = [{ graph: "Homens vs Mulheres" , fem: feminino, mas: masculino, nao: naoInformado }];
    
    var treatedData=['mas','fem', 'nao'].map(function(key,i){
        return jTotal.map(function(d,j){
            return {x: d['graph'], y: d[key] };
        })
    })

    return(treatedData);
}

var drawStackedGraph = function(data, selector){
    var margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .35);

    var y = d3.scale.linear()
            .rangeRound([height, 0]);

    var color = d3.scale.ordinal().range(['#2B3A67', '#E84855', "#222"]);

    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
            
    var svg = d3.select(selector)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var dataStackLayout = d3.layout.stack()(data);

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
}

var errorLoading = function(selector){
    var pai = $(selector).closest("[data-graph]")[0];
    $(pai).addClass("not-loaded");
}

var data = {};

//genero total
$.ajax({
    type: 'GET',
    dataType: 'json',
    url: "data/ba-ds-genero.json",
    data: data
}).done(function(data){
    drawStackedGraph(treatData(data), "#genero svg")
    var parent = $("#genero svg").closest("[data-graph]")[0];
    $(parent).removeClass("not-loaded");
}).fail(errorLoading("#genero svg"));

var data = {};

//genero eleitorado
$.ajax({
    type: 'GET',
    dataType: 'json',
    url: "data/perfil-genero.json",
    data: data
}).done(function(data){
    console.log(data);
    drawStackedGraph(treatData(data), "#genero-eleitorado svg")
    var parent = $("#genero-eleitorado svg").closest("[data-graph]")[0];
    $(parent).removeClass("not-loaded");
}).fail(errorLoading("#genero-eleitorado svg"));