function createD3Map(){

    var width = 1200,
        height = 900,
        centered;
    
    var projection = d3.geo.mercator()
        .scale(250)
        .translate([width / 2, height / 2]);
        //d3.geo.albersUsa()
    
    var path = d3.geo.path()
        .projection(projection);
    
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
    
    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", showBox);
    
    var g = svg.append("g");
    
    d3.json("/json_sample_data/worldmap.json", function(error, world) { 
      if (error) throw error;
      //PROJECT_DATA_MAPPER.getProjectsByCountryCode()
    
      g.append("g")
          .attr("id", "states")
        .selectAll("path")
          .data(topojson.feature(world, world.objects.subunits).features)
        .enter().append("path")
          .attr("d", path)
          .attr("id", function(d) {return d.id;})
          .attr("data-num-of-projects", function(d) {
              var projectArray = PROJECT_DATA_MAPPER.getProjectsByCountryCode(d.id);
                return projectArray.length.toString();
            })
          .attr("fill", function(d) {
              var projectArray = PROJECT_DATA_MAPPER.getProjectsByCountryCode(d.id);
              
              if(projectArray.length == 0){
                  return "#eeeeee";
              }
              else if(projectArray.length > 0 && projectArray.length < 3){
                  return "#228844";
              }
              else if(projectArray.length >= 3 && projectArray.length < 5){
                  return "#663300";
              }
                return "red";
            })
          .on("mouseover", showBox)
          .on("mouseout", hideBox);
    
      g.append("path")
          .datum(topojson.mesh(world, world.objects.subunits, function(a, b) { return a !== b; }))
          .attr("id", "state-borders")
          .attr("d", path);
    });
    
    function showBox(d) {
      var eventData = d3.event;
      var targetElement = eventData.currentTarget;
      var projectBoxContent = PROJECT_DATA_MAPPER.getPopUpContentsByCountryCode(targetElement.id);
      var projectBox = document.getElementById('project-box');
      
      if(projectBoxContent){
          projectBox.innerHTML = projectBoxContent;
          projectBox.style.display = "block";
          projectBox.style.top = eventData.pageY + "px";
          projectBox.style.left = eventData.pageX + "px";
      }
      else {
          projectBox.style.display = "none";
      }
    }
    
    function hideBox(d){
        var projectBox = document.getElementById('project-box');
        projectBox.style.display = "none";
    }
    
    
    /* 
    
     original click function which zooms into clicked country on map
    
    function clicked(d) {
     
      var x, y, k;
    
      if (d && centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;
      } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
      }
    
      g.selectAll("path")
          .classed("active", centered && function(d) { return d === centered; });
    
      g.transition()
          .duration(750)
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
          .style("stroke-width", 1.5 / k + "px");
    }*/ 
}

