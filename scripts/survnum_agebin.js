
function draw_survnum_agebin() {

    // variable for tooltip 
    var divTooltip = d3.select("div.tooltip")

	var margin = {top: 50, right: 30, bottom: 50, left: 40};	
    //var width = document.getElementById('vizcont').clientWidth;
    var width = document.getElementById('pageContain').clientWidth -margin.left - margin.right ;
	var height = width / 3.236;		

    var x_attrib = [];
    //d3.max(data, function(d) { return +d.Total; })

	var svg = d3.select("#vizcont")
				  .append("svg")
				  .attr("width", width + margin.left + margin.right)
				  .attr("height", height + margin.top + margin.bottom)	
	
    var g = svg.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Azis x0 scale for AgeBins
    var x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    // Axis x1 for Survived Yes or No
    var x1 = d3.scaleBand()
        .padding(0.0);

    // creating a linear scale for y axis
    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    // Array of colors for Survived Yes or No
    var z = d3.scaleOrdinal()
        .range(['#e8505b','#2bb2bb']);


    // reading csv data 
	d3.csv("../data/2d_titanic_agebin_surv.csv", function(d, i, columns) {
        for (var i = 1, n = columns.length; i < n; ++i)
            d[columns[i]] = +d[columns[i]];
        return d;
    }, function(data) {
        
		// x0 domain -> list of AgeBins
        x0.domain(data.map(function(d) {
            return d.AgeBin;
        }));
				
        // Array for columns Survived Yes and No
        var keys = data.columns.slice(1)

        // x1 domain -> Survived Yes and No
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);
		
		// y domain -> 0 to max of values across both Survived Yes and No
		y.domain([0,160])
		
        // binding axis and data to svg group elements
    g.append("g")
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("transform", function(d) {
                return "translate(" + x0(d.AgeBin) + ",0)";
            })
            .selectAll("rect")
            .data(function(d) {
                return keys.map(function(key) {
                    return { key: key, value: d[key]};
                });
            })
            .enter()
            .append("rect")
            .transition()     // adds animation
			.duration(1000)
            //.attr("class", "bar")
            .attr("x", function(d) {
                x_attrib.push( x1(d.key) );
                return x1(d.key);
            })
            .attr("width", x1.bandwidth())
            .attr("fill", function(d) {
                return z(d.key);
            })
            .attr("y", function(d) {return y(0); })
            .attr("height", function(d) { return height - y(0); })
            .attr("y", function(d) {return y(d.value); })
            .attr("height", function(d) {return height - y(d.value);})
            .selection()			
            // setting up tooltip and interactivity
		
            .on("mouseover", function(d) {
                divTooltip.style("left", d3.event.pageX + 10 + "px")
                divTooltip.style("top", d3.event.pageY - 25 + "px")
                divTooltip.style("display", "inline-block")
                divTooltip.style("opacity", "0.9");
                var x2 = d3.event.pageX,
                    y2 = d3.event.pageY;
                //console.log(x2);
                //console.log(y2);
                var elements = document.querySelectorAll(":hover");
                var l = elements.length - 1;
                var elementData = elements[l].__data__;
                //console.log(elementData)
                divTooltip.html(elementData.key + "<br>" + elementData.value);
                d3.select(this)
					.transition()     // adds animation
				    .duration(400)
				    .attr('width', x1.bandwidth() + 5)
				    .attr("y", function(d) { return y(d.value) - 10; })
				    .attr("height", function(d) { return height - y(d.value) + 10; });
					

            })
            .on("mouseout", function(d) {
                divTooltip.style("display", "none")
                d3.select(this)
				    .transition()     // adds animation
					.duration(400)
					.attr('width', x1.bandwidth())
					.attr("y", function(d) { return y(d.value); })
					.attr("height", function(d) { return height - y(d.value); });
            })
            // setting up transition, delay and duration
        
        g.transition()
        .duration(1000)
         /*   
         .transition()
         .ease(d3.easeLinear)
         .duration(1000)
         .delay(function (d, i) {
             return i * 50;
			})*/;

        // setting up x axis    
        g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            // setting up x axis opacity to 0 before transition
            .style("opacity", "0")
            .call(d3.axisBottom(x0))
            .style("font", "14px 'Calibri'");
        // setting up transiton for x axis
        g.select(".x")
            .transition()
            .duration(500)
            //.delay(800)
            // setting up full opacity after transition 
            .style("opacity", "1")

        // setting up y axis    
        g.append("g")
            .attr("class", "y axis")
            // setting up y axis opacity to 0 before transition
            .style("opacity", "0")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .style("font", "14px 'Calibri'")
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.90em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .text("Count of Passenger");
        // setting up y axis transition    
        g.select(".y")
            .transition()
            .duration(500)
            //.delay(1300)
            // setting up full opacity after transition
            .style("opacity", "1")

        // setting a legend and binding legend data to group    
        var legend = g.append("g")
             .attr("font-family", "Calibri")
            .attr("font-size", 14)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice())
            .enter()
            .append("g")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 13 + ")";
            })
            // setting up opacity to 0 before transition
            .style("opacity", "0");

        // setting up rectangles for the legend    
        legend.append("rect")
            .attr("x", width - 19)
            .attr("y", -22)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", z);
        // setting up legend text    
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", -15)
            .attr("dy", "0.32em")
            .text(function(d) {
                return d;
            });
        // setting transition delay and duration for all individual elements for the legend    
        legend.transition()
            .duration(500)
			/*
            .delay(function(d, i) {
                return 1300 + 100 * i;
            })*/
            // setting up opacity back to full
            .style("opacity", "1");	
			


        var ga   = svg.append("g")
                    //.transition() 
                    //.duration(1000)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        //young adult  
        ga
        .append("line")
        .attr("x1",  280)
        .attr("y1", 120)
        .attr("x2", 235 )
        .attr("y2", 75)				
        //.attr("x2", 425)
        //.attr("y2", -30)
        .attr("stroke", "darkgrey")
        .style("stroke-width", "1px")
        .style("stroke-dasharray", "5,3")				

        ga.append("circle")
        .attr("cx", 235)
        .attr("cy", 75)						  
        .attr("r",5)
        .style("fill", "darkgrey")	

        ga.append("foreignObject")
        .attr("width", 250)
        .attr("height", 50)
        .attr("x",100 )
        .attr("y",10)
        .append("xhtml:body")
        .style("font", "14px 'Calibri'")
        .style("color", "grey")
        .html("Top 1 Casuality <br> (146 out of 230 Young adults deceased)")						
                    
			
			
			
    });
	
	}