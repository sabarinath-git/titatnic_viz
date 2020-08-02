function draw_surv_gender_agebin() {
   // variable for tooltip 
    var divTooltip = d3.select("div.tooltip")

	
		var margin = {top: 50, right: 30, bottom: 50, left: 40};	
		var width = document.getElementById('pageContain').clientWidth -margin.left - margin.right ;
		var height = width / 3.236;	
		var groupSpacing = 6;	
	
 
	  var x0 = d3.scaleBand()
		.rangeRound([0, width])
		.paddingInner(0.1);
	 
	//var x1 = d3.scale.ordinal();
	  var x1 = d3.scaleBand()
			 	 //.padding(0.8);
	 

	  var y = d3.scaleLinear()
		.rangeRound([height, 0]);	
	 
		
	var xAxis = d3.axisBottom(x0) 

	var yAxis = d3.axisLeft(y).ticks(null, "s")	
							  
	
	var color = d3.scaleOrdinal()
        .range(["#dd93b4", "#aa2169", "#99d6f5", "#278acb"]);

	var svg = d3.select("#vizcont")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	 
	var yBegin;
 
	var stackCol = {
	  "column1" : ["female_survived","female_deceased"],
	  "column2" : ["male_survived","male_deceased"]
	}
 
	d3.csv("3_age_gen_surv_counts.csv", function(error, data) {
	  var columnHeaders = d3.keys(data[0]).filter(function(key) { return key !== "age_bin"; });
	  //console.log(columnHeaders);
	  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "age_bin"; }));
	  data.forEach(function(d) {
		var yColumn = new Array();
		d.columnDetails = columnHeaders.map(function(name) {
		  for (ic in stackCol) {
			//if($.inArray(name, stackCol[ic]) >= 0){
			if(stackCol[ic].indexOf(name) >= 0){
			
			  if (!yColumn[ic]){
				yColumn[ic] = 0;
			  }
			  yBegin = yColumn[ic];
			  //console.log(name,yColumn[ic]);
			  yColumn[ic] += +d[name];
			  //console.log(yColumn[ic]);
			  //console.log({name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin,});
			  return {name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin,};
			}
		  }
		});
		
		
		//console.log(d.columnDetails);
		d.total = d3.max(d.columnDetails, function(d) { 
		  //console.log(d.yEnd);	
		  return d.yEnd; 
		 
		});
	  });
	  //console.log(data);
	  x0.domain(data.map(function(d) { return d.age_bin; }));
	    x1.domain(d3.keys(stackCol)).rangeRound([0, x0.bandwidth()]);
	 
	  y.domain([0, d3.max(data, function(d) { 
		return d.total; 
		})]);

		svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.style("font", "14px 'Calibri'");

			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.style("font", "14px 'Calibri'")
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".7em")
				.style("text-anchor", "end")
				.text("");							
		

	  var project_stackedbar = svg.selectAll(".project_stackedbar")
		  .data(data)
		.enter().append("g")
		  .attr("class", "g")
		  .attr("transform", function(d) { return "translate(" + x0(d.age_bin) + ",0)"; });
	 
	  project_stackedbar.selectAll("rect")
		  .data(function(d) { return d.columnDetails; })
		.enter().append("rect")
		.transition() // and apply changes to all of them
		.duration(1000)
			.attr("width", x1.bandwidth() )
		  .attr("x", function(d) { 
				return x1(d.column);		
			 })
		  .attr("y", function(d) { 
			return y(d.yEnd); 
		  })
		  .attr("height", function(d) { 
			return y(d.yBegin) - y(d.yEnd); 
		  })
			.style("fill", function(d) { return color(d.name); })//;
			.selection()
          .on("mouseover", function(d) {  // Add interactivity
                divTooltip.style("left", d3.event.pageX + 10 + "px")
                divTooltip.style("top", d3.event.pageY - 25 + "px")
                divTooltip.style("display", "inline-block")
                divTooltip.style("opacity", "0.9");
                var x2 = d3.event.pageX,
										y2 = d3.event.pageY;
                var elements = document.querySelectorAll(":hover");
                var l = elements.length - 1;
                var elementData = elements[l].__data__;
				var val = elementData.yEnd - elementData.yBegin
				d3.select(this)
				.transition()
				.duration(400)
				.style("stroke", "black")
				.style("opacity", 1)
				divTooltip.html(elementData.name +"<br>" + val);
	
					  

		
          })		  
		  .on("mouseout", function(d) {
                divTooltip.style("display", "none")
                d3.select(this)
				    .transition()     // adds animation
					.duration(400)
					.style("stroke", "none")
					.style("opacity", 1)
						})	

	  var legend = svg.selectAll(".legend")
			.data(columnHeaders.slice())
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
		.attr("font-family", "Calibri")
		.attr("font-size", 14)
		.attr("text-anchor", "end");
	 
	  legend.append("rect")
		  .attr("x", width - 18)
		  .attr("width", 18)
		  .attr("height", 18)
		  .style("fill", color);
	 
	  legend.append("text")
		  .attr("x", width - 24)
		  .attr("y", 9)
		  .attr("dy", ".35em")
		  .style("text-anchor", "end")
			.text(function(d) { return d; });
			
         //Get the attibutes of the rectangles for positioning Title & Annotations
         var rects = svg.selectAll("rect");	
         var rect_x = rects.nodes().map(function(d) { return d.getAttribute("x"); })
         var rect_y = rects.nodes().map(function(d) { return d.getAttribute("y"); })
         var rect_w = rects.nodes().map(function(d) { return d.getAttribute("width"); })
         var rect_h = rects.nodes().map(function(d) { return d.getAttribute("height"); })
         //console.log(parseFloat(rect_x[4]) + parseFloat(rect_w[4]));
                 
 
       var ga   = svg.append("g")
                    //.transition() 
                    //.duration(1000)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        //Senior
        ga
        .append("line")
        .attr("x1", 855)
        .attr("y1", 285)
        .attr("x2", 820 )
        .attr("y2", 230)				
        //.attr("x2", 425)
        //.attr("y2", -30)
        .attr("stroke", "darkgrey")
        .style("stroke-width", "1px")
        .style("stroke-dasharray", "5,3")				

        ga.append("circle")
        .attr("cx", 818)
        .attr("cy", 225)						  
        .attr("r",5)
        .style("fill", "darkgrey")	

        ga.append("foreignObject")
        .attr("width", 200)
        .attr("height", 50)
        .attr("x",700 )
        .attr("y",160)
        .append("xhtml:body")
        .style("font", "14px 'Calibri'")
        .style("color", "grey")
				.html("Senior - 13 of 17 deceased <br> 100% (3 of 3) Female Survived <br>  7% (1 of 14) Male Survived")					
				

        //Senior
        ga
        .append("line")
        .attr("x1", 1025)
        .attr("y1", 280)
        .attr("x2", 1001 )
        .attr("y2", 230)				
        //.attr("x2", 425)
        //.attr("y2", -30)
        .attr("stroke", "darkgrey")
        .style("stroke-width", "1px")
        .style("stroke-dasharray", "5,3")				

        ga.append("circle")
        .attr("cx", 999)
        .attr("cy", 225)						  
        .attr("r",5)
        .style("fill", "darkgrey")	

        ga.append("foreignObject")
        .attr("width", 200)
        .attr("height", 100)
        .attr("x",900 )
        .attr("y",145)
        .append("xhtml:body")
        .style("font", "14px 'Calibri'")
        .style("color", "grey")
        .html("Elderly - 1 of 5 deceased <br> 20% (1 of 5) Male Survived <br>  No Female passenger <br> in this category")					
 
});

}
