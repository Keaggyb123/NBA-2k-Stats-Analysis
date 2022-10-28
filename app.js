function assignment9(){
    var filePath="data.csv";
    question0(filePath);
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
}

var question0=function(filePath){
    d3.csv(filePath).then(function(data){
        console.log(data)
    });
}

var question1=function(filePath){
    var rowConverter = function(d){
        return {
        full_name: d.full_name,
        rating: parseInt(d.rating),
        jesery: d.jersey,
        team: d.team,
        position:d.position,
        b_day: d.b_day,
        country: d.country,
        draft_year:d.draft_year,
        college:d.college,
        height : parseInt(d.height),
        weight : parseInt(d.weight),
        salary : parseInt(d.salary),
        draft_pick : parseInt(d.draft_pick)
        }      
}
    //reading data
    d3.csv(filePath,rowConverter).then(data=>{

        var margin = {top: 30, right: 30, bottom: 30, left: 80},
        width = 850 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
        var svg = d3.select("#q1_plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        salaryArr = []
        let maxSal = 0 
        for(let i=0; i <data.length;i++ ){
            temp = {}
            temp['pick'] = data[i].draft_pick
            temp['value'] = data[i].salary
            salaryArr.push(temp)
            if(maxSal < data[i].salary){
                maxSal = data[i].salary
            }
        }
        rateArr = []
        let maxRate = 0 
        for(let i=0; i <data.length;i++ ){
            temp = {}
            temp['pick'] = data[i].draft_pick
            temp['value'] = data[i].rating
            rateArr.push(temp)
            if(maxRate < data[i].rating){
                maxRate = data[i].rating
            }
        }
        console.log(salaryArr)
        var x = d3.scaleLinear()
                .range([ 0, width ]);
        var xAxis = d3.axisBottom().scale(x);
                svg.append("g")
                  .attr("transform", "translate(0," + height + ")")
                  .attr("class","myXaxis")

        var y = d3.scaleLinear().range([height, 0]);
        var yAxis = d3.axisLeft().scale(y);
                svg.append("g")
                  .attr("class","myYaxis")

        function update(data){

            x.domain([0, d3.max(data, function(d) { return d.pick }) ]);
            svg.selectAll(".myXaxis").transition()
                .duration(3000)
                .call(xAxis);

            y.domain([d3.min(data, function(d) { return d.value  }) , d3.max(data, function(d) { return d.value  }) ]);
            svg.selectAll(".myYaxis")
                .transition()
                .duration(3000)
                .call(yAxis)              
                .selectAll("text")
                .attr("transform", "translate(0,0)rotate(-25)")
                .style("text-anchor", "end");;

            var u = svg.selectAll(".points")
                    .data(data);
            u
            .enter()
            .append("circle")
            .attr("class","points")
            .merge(u)
            .transition()
            .duration(3000)
            .attr("cx", function (d) { return x(d.pick); } )
            .attr("cy", function (d) { return y(d.value); } )
            .attr("r", 3)
            .style("fill", "Purple");
        }
        update(salaryArr)
        d3.select('#q2_Sal')
            .on('click',function(){
            update(salaryArr)
        })
        d3.select('#q2_Rate')
            .on('click',function(){
            update(rateArr)
        })
        console.log(rateArr)

        
        svg.append("text")
                  .attr("text-anchor", "end")
                  .attr("transform", "rotate(-90)")
                  .attr("y", -margin.left + 20)
                  .attr("x", -margin.top)
                  .text("NBA PLayer Salaries($)")

        svg.append("text")
                  .attr("text-anchor", "end")
                  .attr("x", width - 0.5*width)
                  .attr("y", height + margin.top)
                  .text("Draft Pick");
            })  
    
}
//
var question2=function(filePath){
    var rowConverter = function(d){
        return {
        full_name: d.full_name,
        rating: parseInt(d.rating),
        jesery: d.jersey,
        team: d.team,
        position:d.position,
        b_day: d.b_day,
        country: d.country,
        draft_year:d.draft_year,
        college:d.college,
        height : parseInt(d.height),
        weight : parseInt(d.weight),
        salary : parseInt(d.salary),
        draft_pick : parseInt(d.draft_pick)
        }      
}
    d3.csv(filePath,rowConverter).then(function(data){
        var margin = {top: 35, right: 35, bottom: 85, left: 75},
        width = 1150 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

        function noTeam(d){
            if(d['team'] != "No Team"){
                    return d
                }
        }
        const data2 = data.filter(noTeam)

        var roll = d3.rollup(data2, v => d3.sum(v,d => d.salary), d=>d.team)
        const arr = []
        roll2 = Array.from(roll).sort(compareSecondColumn)
        function compareSecondColumn(a, b) {
            if (a[1] === b[1]) {return 0;}
            else {return (a[1] > b[1]) ? -1 : 1;}
        }
        maxSal = 0
        for(let i = 0; i< roll2.length; i++){
            temp = {}
            temp['team'] = roll2[i][0]
            temp['salary'] = roll2[i][1]
            arr.push(temp)
            if(maxSal < roll2[i][1]){
                maxSal = roll2[i][1]
            }
        }

        // append the svg object to the body of the page
        var svg = d3.select("#q2_plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
        

        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(arr.map(function(d) { return d.team; }))
            .padding(.2)

          svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
              .attr("transform", "translate(-11,2)rotate(-45)")
              .style("text-anchor", "end");
          
          // Add Y axis
          var y = d3.scaleLinear()
            .domain([0, maxSal])
            .range([ height, 0]);
          svg.append("g")
            .call(d3.axisLeft(y))           
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");;

            svg.selectAll("mybar")
            .data(arr)
            .join("rect")
              .attr("x", d => x(d.team))
              .attr("width", x.bandwidth())
              .attr("fill", "#69b3a2")
              // no bar at the beginning thus:
              .attr("height", d => height - y(0)) // always equal to 0
              .attr("y", d => y(0))

            svg.selectAll("rect")
              .transition()
              .duration(6000)
              .attr("y", d => y(d.salary))
              .attr("height", d => height - y(d.salary))
              .delay((d,i) => {console.log(i); return i*100})
        
            svg.append("text")
              .attr("text-anchor", "end")
              .attr("transform", "rotate(-90)")
              .attr("y", -margin.left+12)
              .attr("x", -margin.top)
              .text("NBA Team Salaries")

            svg.append("text")
              .attr("text-anchor", "end")
              .attr("x", width+25)
              .attr("y", height + margin.top + 25)
              .text("NBA Team");
      
        
    })
}

var question3=function(){
    Promise.all([d3.json('world.json'),d3.csv('data.csv')]).then(function(loadData){
        let json = loadData[0]
        let csv = loadData[1]

        const country = d3.rollup(csv,v => d3.mean(v,d => d.rating), d=> d.country)
        const countArr = Array.from(country).sort()
        const arr = []
        max_r = 0
        min_r = countArr[0][1]

        for(let i = 0; i < countArr.length; i++){

            temp = []
            temp['country'] = countArr[i][0]
            temp['rating'] = countArr[i][1]
            arr.push(temp)
            if(min_r > countArr[i][1]){
                min_r = countArr[i][1]
            }
            if(max_r < countArr[i][1]){
                max_r = countArr[i][1]
            }
        }

        var margin = {top: 30, right: 30, bottom: 80, left: 70},
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

        var svg = d3.select("#q3_plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")    
       .append("g");

        const colorScale = d3.scaleLinear()
            .range(["white", "Red"])
            .domain([min_r,max_r]);

        const path = d3.geoPath();
        const projection = d3.geoMercator()
            
                // Data and color scale

        var Tooltip = d3.select("#q3_plot")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 1)
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")

        let zoom = d3.zoom().on('zoom', handleZoom);
              
        function handleZoom(e) {
                d3.select('svg g')
                  .attr('transform', e.transform);
            }
              
        function initZoom() {
                d3.select('svg')
                  .call(zoom);
            }

        const mouseover = function(event,d) {
                    Tooltip
                      .style("opacity", 1)
                  }
        var mousemove = function(event,d) {
            
                    Tooltip
                      .html(d.properties.name + " has an average rating of " + Math.round(country.get(d.properties.name)))
                      .style("left", (event.pageX) + "px")
                      .style("top",  (event.pageY) + "px")
                  }
        const mouseleave = function(event,d) {
                    Tooltip
                      .style("opacity", 0)
                }
        let data = new Map()
        function update(){
        svg.append("g")
            .selectAll("path")
            .data(json.features)
            .join("path")
            // draw each country
            .attr("d", d3.geoPath().projection(projection)) 
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("fill", function (d) {
                if(country.get(d.properties.name) >= min_r){
                    return colorScale(country.get(d.properties.name));
                }
                else{
                    return "white"
                }
            })                  
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
        }
        initZoom();
        update();
    })
}
var question4=function(filePath){
    var rowConverter = function(d){
            return {
            full_name: d.full_name,
            rating: parseInt(d.rating),
            jesery: d.jersey,
            team: d.team,
            position:d.position,
            b_day: d.b_day,
            country: d.country,
            draft_year:d.draft_year,
            college:d.college,
            height : parseInt(d.height),
            weight : parseInt(d.weight),
            salary : parseInt(d.salary),
            draft_pick : parseInt(d.draft_pick)
            }  
        }
    d3.csv(filePath,rowConverter).then(function(data){
            var margin = {top: 10, right: 30, bottom: 90, left: 50},
            width = 900 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;
            var svg = d3.select("#q4_plot")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")");
            function top10(d) {
                    if(d['draft_pick'] < 11){
                        if(d['team'] != "No Team"){
                        return d
                        }
                    }
                }
            function secondR(d){
                if(d['draft_pick'] > 30){
                    if(d['team'] != "No Team"){
                        return d
                        }
                }
            }
            const topicks = data.filter(top10)
            const second = data.filter(secondR)
            toproll = d3.rollup(topicks, v => v.length, d => d.team)
            secondroll = d3.rollup(second, v => v.length, d => d.team)
            arr1 = Array.from(toproll).sort()
            arr2 = Array.from(secondroll).sort()

            

            arr = []
            max_comb = 0
            teams = []
            num = []
            for(let i = 0; i < arr1.length; i++){
                temp = {}
                temp['team'] = arr1[i][0]
                temp['top10'] = arr1[i][1]
                temp['second'] = arr2[i][1]
                arr.push(temp)
                num.push(i)
                teams.push(arr1[i][0])
                total = arr1[i][1] + arr2[i][1]
                if(total > max_comb){
                    max_comb = total
                }
            }
            var x = d3.scaleBand()
                .domain(teams)
                .range([0, width])
                .padding([0.2])
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSizeOuter(0))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-35)")
                .style("text-anchor", "end");

            var y = d3.scaleLinear()
                .domain([0, max_comb])
                .range([ height, 0 ]);
              svg.append("g")
                .call(d3.axisLeft(y));

            var color = d3.scaleOrdinal()
                .domain(['top10','second'])
                .range(['#e41a1c','#377eb8'])

            var stackedData = d3.stack()
                .keys(['top10','second'])(arr)
        
                
            svg.append("circle").attr("cx",width-175).attr("cy",5).attr("r", 6).style("fill", '#e41a1c')
            svg.append("circle").attr("cx",width-175).attr("cy",25).attr("r", 6).style("fill", '#377eb8')
            svg.append("text").attr("x", width - 165).attr("y", 5).text("Amount of Top 10 Picks").style("font-size", "15px").attr("alignment-baseline","middle")
            svg.append("text").attr("x", width - 165).attr("y", 25).text("Amount of Second Round Picks").style("font-size", "15px").attr("alignment-baseline","middle")

        
            svg.append("g")
                .selectAll("g")
                .data(stackedData)
                .enter().append("g")
                  .attr("fill", function(d,i) { 
                      return color(i); 
                    })
                  .selectAll("rect")
                  // enter a second time = loop subgroup per subgroup to add all rectangles
                  .data(function(d) { return d; })
                  .enter().append("rect")
                    .attr("x", function(d) { 
                        return x(d.data.team); 
                    })
                    .attr("y", function(d) { return y(d[1]); })
                    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                    .attr("width",x.bandwidth() );

                    svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -margin.left+15)
                    .attr("x", -margin.top)
                    .text("Combined Amount of Top 10 Picks and Second Round Picks")
      
                  svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", width+35)
                    .attr("y", height + margin.top + 35)
                    .text("NBA Team");

        });
    }
    var question5=function(filePath){
        var rowConverter = function(d){
                return {
                full_name: d.full_name,
                rating: parseInt(d.rating),
                jesery: d.jersey,
                team: d.team,
                position:d.position,
                b_day: d.b_day,
                country: d.country,
                draft_year:d.draft_year,
                college:d.college,
                height : parseInt(d.height),
                weight : parseInt(d.weight),
                salary : parseInt(d.salary),
                draft_pick : parseInt(d.draft_pick)
                }  
            }
        d3.csv(filePath,rowConverter).then(function(data){
            var margin = {top: 30, right: 50, bottom: 50, left: 90},
            width = 600 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;
          
          // append the svg object to the body of the page
          var svg = d3.select("#q5_plot")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

           sal = []
           maxSal = 0
           minSal = data[0].salary
           for(let i =0; i<data.length;i++){
               sal.push(data[i].salary)
               if(maxSal < data[i].salary){
                   maxSal = data[i].salary
               }
               if(minSal > data[i].salary){
                minSal = data[i].salary
            }
               
           } 

            var data_sorted = sal.sort(d3.ascending)
            var q1 = d3.quantile(data_sorted, .25)
            var median = d3.quantile(data_sorted, .5)
            var q3 = d3.quantile(data_sorted, .75)
            var interQuantileRange = q3 - q1
            var min = minSal//q1 - 1.5 * interQuantileRange
            var max = maxSal//q1 + 1.5 * interQuantileRange

            var y = d3.scaleLinear()
                    .domain([min,max])
                    .range([height, 0]);
                svg.call(d3.axisLeft(y))                
                .selectAll("text")
                .attr("transform", "translate(-5,0)rotate(-45)")
                .style("text-anchor", "end");


                var center = 200
                var width = 100
                
                // Show the main vertical line
                svg
                .append("line")
                  .attr("x1", center)
                  .attr("x2", center)
                  .attr("y1", y(min) )
                  .attr("y2", y(max) )
                  .attr("stroke", "black")
                
                // Show the box
                svg
                .append("rect")
                  .attr("x", center - width/2)
                  .attr("y", y(q3) )
                  .attr("height", (y(q1)-y(q3)) )
                  .attr("width", width )
                  .attr("stroke", "black")
                  .style("fill", "#69b3a2")
                
                // show median, min and max horizontal lines
                svg
                .selectAll("toto")
                .data([min, median, max])
                .enter()
                .append("line")
                  .attr("x1", center-width/2)
                  .attr("x2", center+width/2)
                  .attr("y1", function(d){ return(y(d))} )
                  .attr("y2", function(d){ return(y(d))} )
                  .attr("stroke", "black")

                  svg.append("text")
                  .attr("text-anchor", "end")
                  .attr("transform", "rotate(-90)")
                  .attr("y", -margin.left+25)
                  .attr("x", -margin.top-50)
                  .attr("stroke", "black")
                  .style("font-size", "14px")
                  .text("NBA Salaries ($)")

          
        });
    }