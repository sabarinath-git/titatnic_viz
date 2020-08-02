
function draw_agehist() {
    // Survival Percentage by Age Bin
	
	 // variable for tooltip 
    var divTooltip = d3.select("div.tooltip")
    
	var margin = {top: 50, right: 30 , bottom: 50, left: 40};	
	var width = document.getElementById('pageContain').clientWidth -margin.left - margin.right ;
    //console.log(document.getElementById('pageContain').clientWidth)
	var height = width / 3.236;	

	   
	var svg = d3.select("#vizcont")
				  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  //.attr("width", width - margin.left - margin.right)
				  .attr("height", height + margin.top + margin.bottom)
	var g   = svg.append("g")
					.attr("transform",
						  "translate(" + margin.left + "," + margin.top + ")");	

    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.03);
    var y = d3.scaleLinear().range([height, 0]);


	d3.csv("titanicpyagenn.csv", function(error, data) {
        if (error) {
            throw error;
        }

        //console.log(d3.max(data, function(d) { return +d.Total; }));
        x.domain(data.map(function(d) { return d.AgeBin; }));
        y.domain([0, d3.max(data, function(d) { return +d.Total; })]);

        g.append("g")
		 .attr("transform", "translate(0," + height + ")")
		 //.transition() // and apply changes to all of them
		 //.duration(1000)			 
            .call(d3.axisBottom(x))
            .style("font", "14px 'Calibri'")

        g.append("g")
         .call(d3.axisLeft(y).tickFormat(function(d){
             return d;
         })
         .ticks(8))
         .style("font", "14px 'Calibri'")



        g.selectAll(".bar")
         .data(data)
         .enter()
		 .append("rect")
         .attr("class", "bar")        
         .on("mouseover", function(d) { // Listener to handle mouseover event
			//d3.select(this).attr('class', 'bar');
            divTooltip.style("left", d3.event.pageX + 10 + "px")
            divTooltip.style("top", d3.event.pageY - 25 + "px")
            divTooltip.style("display", "inline-block")
            divTooltip.style("opacity", "0.9");

            var elements = document.querySelectorAll(":hover");
			
            var l = elements.length - 1;
            var elementData = elements[l].__data__;
            //console.log(elementData.AgeBin)
            var binPCnum = (elementData.Total / 714)*100;
            var binPcr = Math.round(binPCnum );
            divTooltip.html( "Count of Passengers: "+elementData.Total+  "<br>" + "Perc of Passengers:" + binPCnum.toFixed(2) + "%");            
            //divTooltip.html("Survival Rate" + "<br>" + elementData.Total + " % ");		
			d3.select(this)
			.transition()     // adds animation
			.duration(400)
			.attr('width', x.bandwidth() + 5)
			.attr("y", function(d) { return y(d.Total) - 10; })
			.attr("height", function(d) { return height - y(d.Total) + 10; });
		 })
         .on("mouseout", function(d) { // Listener to handle mouseover event
			divTooltip.style("display", "none")
			d3.select(this).attr('class', 'bar');
			d3.select(this)
			  .transition()     // adds animation
			  .duration(400)
			  .attr('width', x.bandwidth())
			  .attr("y", function(d) { return y(d.Total); })
			  .attr("height", function(d) { return height - y(d.Total); });

			d3.selectAll('.val')
			  .remove()
			})
			 
         .attr("x", function(d) { return x(d.AgeBin); })
         .attr("y", function(d) { return y(d.Total); })
         .attr("width", x.bandwidth())
         .transition()
         //.ease(d3.easeLinear)
         .duration(1000)
         .delay(function (d, i) {
             return i * 50;
         })
         .attr("height", function(d) { return height - y(d.Total); })

    	

         //Get the attibutes of the rectangles for positioning Title & Annotations
         var rects = svg.selectAll("rect");	
         var rect_x = rects.nodes().map(function(d) { return d.getAttribute("x"); })
         var rect_y = rects.nodes().map(function(d) { return d.getAttribute("y"); })
         var rect_w = rects.nodes().map(function(d) { return d.getAttribute("width"); })
         var rect_h = rects.nodes().map(function(d) { return d.getAttribute("height"); })
         /*console.log (parseFloat(rect_x[0]) );
         console.log (parseFloat(rect_y[0]) );
         console.log ( parseFloat(rect_w[0]));
         console.log ( parseFloat(rect_h[0]));*/
                 
        var ga   = svg.append("g")
        //.transition() 
        //.duration(1000)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        //children
        ga
        .append("line")
        .attr("x1", (parseFloat( rect_x[0] ) + parseFloat( rect_w[0] ) )/2 + 15)
        .attr("y1", rect_y[0])
        .attr("x2", (parseFloat( rect_x[0] ) + parseFloat( rect_w[0] ) )/2)
        .attr("y2", parseFloat(rect_y[0] ) - 50)
        .attr("stroke", "darkgrey")
        .style("stroke-width", "1px")
        .style("stroke-dasharray", "5,3")					

        ga.append("circle")
        .attr("cx", (parseFloat( rect_x[0] ) + parseFloat( rect_w[0] ) )/2)
        .attr("cy",  parseFloat( rect_y[0] ) - 50)						  
        .attr("r",5)
        .style("fill", "darkgrey")	
        
        ga.append("foreignObject")
        .attr("width", 200)
        .attr("height", 50)
        .attr("x",(parseFloat( rect_x[0] ) + parseFloat( rect_w[0] ) )/3 - 15)
        .attr("y",parseFloat( rect_y[0] ) - 115)
        .append("xhtml:body")
        .style("font", "14px 'Calibri'")
        .style("color", "grey")
        .html("Children - 8.9% <br> (64 out of Total 714 Passengers)")				
        
        //young adult  
        ga
        .append("line")
        .attr("x1",  parseFloat( rect_x[2]) -1)
        .attr("y1", rect_y[3] - 15)
        .attr("x2", parseFloat( rect_x[1] ) + parseFloat( rect_w[1] ) /2 + 35)
        .attr("y2", rect_y[3] - 100)				
        //.attr("x2", 425)
        //.attr("y2", -30)
        .attr("stroke", "darkgrey")
        .style("stroke-width", "1px")
        .style("stroke-dasharray", "5,3")				

        ga.append("circle")
        .attr("cx", parseFloat( rect_x[1] ) + parseFloat( rect_w[1] ) /2 + 35)
        .attr("cy", rect_y[3] - 100)						  
        .attr("r",5)
        .style("fill", "darkgrey")	

        ga.append("foreignObject")
        .attr("width", 200)
        .attr("height", 50)
        .attr("x",parseFloat( rect_x[1] ) + parseFloat( rect_w[1] ) /2 -15 )
        .attr("y",rect_y[3] - 155)
        .append("xhtml:body")
        .style("font", "14px 'Calibri'")
        .style("color", "grey")
        .html("Young adult - 32.2% <br> (230 out of Total 714 Passengers)")				

        // Elderly 
        ga
        .append("line")
        .attr("x1", parseFloat( rect_x[7] ) + parseFloat( rect_w[7] ) /2 + 15)
        .attr("y1", parseFloat( rect_y[7] ) )
        .attr("x2", parseFloat( rect_x[7] ) + parseFloat( rect_w[7] ) /3)
        .attr("y2", parseFloat( rect_y[7] ) - 50)				
        //.attr("x2", 425)
        //.attr("y2", -30)
        .attr("stroke", "darkgrey")
        .style("stroke-width", "1px")
        .style("stroke-dasharray", "5,3")					 

        ga.append("circle")
        .attr("cx",  parseFloat( rect_x[7] ) + parseFloat( rect_w[7] ) /3)
        .attr("cy",  parseFloat( rect_y[7] ) - 50)						  
        .attr("r",5)
        .style("fill", "darkgrey")		
        
        ga.append("foreignObject")
        .attr("width", 250)
        .attr("height", 50)
        .attr("x", parseFloat( rect_x[7] ) + parseFloat( rect_w[7] ) /3  - 60 )
        .attr("y",parseFloat( rect_y[7] ) - 110)
        .append("xhtml:body")
        .style("font", "14px 'Calibri'")
        .style("color", "grey")
        .html("Elderly - 0.7% <br> (5 out of Total 714 Passengers)")			
         

    });

	}
