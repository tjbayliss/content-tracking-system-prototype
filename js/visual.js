
      /*
        FILENAME: visual.js
        WRITTEN BY: JAMES BAYLISS (CONTRACTOR)
        TECHNOLOGIES: D3 (v4), JavaScript (ES5/6), JQuery (latest as at 2nd May 2019), Bootstrap (latest as at 2nd May 2019)
        WRITTEN BETWEEN: April 2019 to May 2019

        DESCRIPTION: function to create D3 focus-context graphs on Work Order tabs, plus related functionality
      */
            



      /*
        FUNCTION NAME: drawChart
        DESCRIPTION: main function to handle drawing of all vis chart content
        CALLED FROM: buildWorkOrderTabs
        CALLS: buildDialogTable
        REQUIRES: WONumber - specific work order for chart being considered
                  WOcounter - numeric counter to WO being considered 
                  dataForWorkOrder - transaction data to display 
                  bodyWidth - body widht
        RETURNS: n/a
      */
      function drawChart(WONumber, WOcounter, dataForWorkOrder, bodyWidth){





          var svg = d3.select("#svg-lower-"+WONumber);
          var margin = { top: 75, right: 0, bottom: 250, left: 400 };
          var margin2 = { top: 500, right: 0, bottom: 25, left: 400 };

          var width = bodyWidth;
          var height = +svg.attr("height") - margin.top - margin.bottom;
          var height2 = +svg.attr("height") - margin2.top - margin2.bottom;

          var dialog = d3.select("body")
                          .append("g")
                          .attr("class" , "dialog-g dialog-g-"+WONumber)
                          .attr("id" , "dialog-g-"+WONumber);

          dialog.append("div")
                .attr("class" , "dialog-base")
                .attr("id" , "dialog-base");

          dialog.append("div")
                .attr("class" , "dialog-header")
                .attr("id" , "dialog-header")
                .style("background-color" , marsColors_secondary[WOcounter]);

          dialog.append("p")
                .attr("class" , "dialog-p itemLabel")
                .attr("id" , "itemLabel-"+WONumber)
                .text("ITEM");

          dialog.append("p")
                .attr("class" , "dialog-p itemCode")
                .attr("id" , "itemCode-"+WONumber);





          /*
            FUNCTION NAME: buildDialogTable 
            DESCRIPTION: builds and defines structure of dialog displayed when user mouse overs a Work Order event/transaction
            CALLED FROM: drawChart
            CALLS: n/a
            REQUIRES: info - a singular JSON object containing all the value added information relating to the WO transaction selected on teh upper interactive chart
            RETURNS: n/a
          */            
          function buildDialogTable(info){


            // declare local array defininf table column header names
            var rowSubjects = [ "Item Description:" , "MGBC:" , "SSCC:" , "Local Pallet ID:" , "BBD:" , "Date and Time:" , "Transaction Type:" , "Quantity:" , "UOM:"];


            // append a simple HTML table to the new instance of dialog created shen user mouse overs WO transaction
            dialog.append("table")
                  .attr( "class" , "dialogTable dialogTable-"+WONumber )
                  .attr( "id" , "dialogTable-"+WONumber );


            // append a table body to the new table
            d3.selectAll( ".dialogTable-"+WONumber )
              .append( "tbody" )
              .attr( "class" , "dialogTable tbody-"+WONumber );


            // for each fieldname element in the local array 
            rowSubjects.forEach(function(d,i){


              // append a new table row
              d3.selectAll(".dialogTable.tbody-"+WONumber )
                .append("tr")
                .attr("width" , "100%")
                .attr("class" , "dialogTableRow Row item-"+i+"-"+WONumber);


              // append a new table data cell. the is the left hand column of two in the table. This column lists the values in array rowSubjects
              d3.selectAll(".dialogTableRow.Row.item-"+i+"-"+WONumber)
                .append("td")
                .attr("width" , "50%")
                .attr("class", "dialogfillers")
                .style("font-weight" ,"bold")
                .text(rowSubjects[i]);


              // append a new table data cell. the is the left hand column of two in the table. This column lists the values specific to the sleected WO transaction relating to the values in array rowSubjects
              d3.selectAll(".dialogTableRow.Row.item-"+i+"-"+WONumber)
                .append("td")
                .attr("width" , "50%")
                .attr("class", "dialogfillers")
                .style("text-anchor" ,"end")
                .text(function(){

                  switch (d) {
                    case "Item Description:":
                      return info["Item Description"];
                      break;

                    case "MGBC:":
                      return info["MGBC"];
                      break;

                    case "FG Item:":
                      return info["MGBC"];
                      break;

                    case "SSCC:":
                      return info["SSCC"];
                      break;

                    case "Local Pallet ID:":
                      return info["Local Pallet ID"];
                      break;

                    case "BBD:":
                      return info["BBD"];
                      break;

                    case "Date and Time:":
                      return info["Date and Time"];
                      break;

                    case "Transaction Type:":
                      return info["Transaction Type"];
                     break;

                    case "Quantity:":
                      return info["Quantity"];
                      break;

                    case "UOM:":
                      return info["UOM"];
                      break;
                  }
                })
            });

            return;

          }// end function buildDialogTable(d)



        // function call to draw legend to SVG. This is the ame function used to draw the legend on the Process Map tab
        drawLegend(svg, WONumber);


        // D3 declaration for time date parser. Need to rad format of '08/04/2019 08:57' 
        var coPacking_parseDate = d3.timeParse("%d/%m/%Y %H:%M");


        // interactive chart declarations. Definitions for X and Y axes for upper and lower chart
        var x = d3.scaleTime().range([0, width-margin.left-margin.right]),    /* upper/focus X lower x axis */
            x2 = d3.scaleTime().range([0, width-margin.left-margin.right]),   /* lower/context X */
            x3 = d3.scaleTime().range([0, width-margin.left-margin.right]),   /* upper/focus X upper x axis */
/*
            x = d3.scaleLinear().range([0, width-margin.left-margin.right]),
            x2 = d3.scaleLinear().range([0, width-margin.left-margin.right]),
            x3 = d3.scaleLinear().range([0, width-margin.left-margin.right]),*/

            y = d3.scaleLinear().range([height, 0]), /* upper/focus Y left hand Y axis */
            y1 = d3.scaleLinear().range([height, 0]), /* lower/context Y left Y axis */
            y2 = d3.scaleLinear().range([height2, 0]) /* upper/focus Y right hand Y axis */


        // additional declaration defintions of axes characteristics
        var xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            xAxis3 = d3.axisTop(x3),
            yAxis = d3.axisLeft(y);
            yAxis1 = d3.axisRight(y1);


        // append new SVG text label to display number of selected transactions/events on current visible WO
        // one each per WO to consider
        svg.append( "text" )
            .attr( "class" , "WOChildCount WOChildCount" + WONumber )
            .attr( "id" , "WOChildCount" + WONumber )
            .attr( "x" , x.range()[1] )
            .attr( "y" , 50 )
            .style("font-weight" , "bold")
            .style("text-anchor" , "start")
            .text( "0 Children selected in WO " + WONumber );


        // define D3 brush for lower 'context' chart
        var brush = d3.brushX()
            .extent([[0, 0], [(width-margin.left-margin.right) , height2]])
            .on("brush end", brushed);


        // define D3 brush for lower 'context' chart
        var zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [(width-margin.left-margin.right), height]])
            .extent([[0, 0], [(width-margin.left-margin.right), height]])
            .on("zoom", zoomed);


        // append an area clip to restrict visible symbols to the chart space
        svg.append("defs").append("clipPath")
            .attr("class", "clip clip-"+WONumber)
            .attr("id", "clip-"+WONumber)
          .append("rect")
            .attr("x", 0 )
            .attr("width", (width-margin.left-margin.right) )
            .attr("height", height );


        // append group element to main SVG panel to contain the upper chart components
        var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // append group element to main SVG panel to contain the lower chart components
        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


        // rename locally the data to consider (hangover from adapting code from this example 'https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172')
        data = dataForWorkOrder;


        // locally define the time x axis limits from the data, round down teh start and up the end to star/end of the day
        var startTime = d3.timeDay.floor( coPacking_parseDate(data[0]["Date and Time"]) );
        var endTime = d3.timeDay.ceil(  coPacking_parseDate(data[data.length-1]["Date and Time"]) );


        // define d3 domains for x- and y- axes
        x.domain([ startTime , endTime ]);

        //x.domain([ 0, 100 ]);
        x2.domain(x.domain());
        x3.domain(x.domain());

        y.domain([0, 1]);
        y1.domain(y.domain());
        y2.domain(y.domain());


        // append group to contain lower x axis to upper focus graph
        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);


        // append group to contain lower x axis to upper focus graph
        focus.append("g")
            .attr("class", "axis axis--x3")
            .attr("transform", "translate(0," + (0) + ")")
            .call(xAxis3);


        // append group to contain left hand y axis to upper focus graph
        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);


        // append group to contain right hand y axis to upper focus graph
        focus.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + (width-margin.left-margin.right-1) + "," + 0 + ")")
            .call(yAxis1);

/*
        console.log("dataForWorkOrder.length")
        console.log(dataForWorkOrder.length)
        ic.xDomainInterval = (x.domain()[1]-x.domain()[0])/dataForWorkOrder.length
        console.log(" ic.xDomainInterval: "+ ic.xDomainInterval)
*/
/*
        var eventLabels = focus.selectAll(".eventLabels-gs")
          .data(dataForWorkOrder)
          .enter()
          .filter(function(d,i){
            return (d["Transaction Type"]=="Used for production" ||  d["Transaction Type"]=="Line Clearance" );
          })
          .append("g")
          .attr("class" , function(d,i){ return "eventLabels-gs eventLabels-gs-"+i+"-"+WONumber; })
          .attr( "transform" , function(d,i){ 
            return "translate(" + x(coPacking_parseDate(d["Date and Time"])) + "," + y(0.5) + ")";
          })
 */

        var eventLabelLines  = focus.selectAll(".eventLabelLines")
                        .data(dataForWorkOrder)
                        .enter()
                        .filter(function(d,i){
                          return (d["Transaction Type"]=="Used for production" || d["Transaction Type"]=="Line Clearance" );
                        })
                        .append("line")
                        .attr("clip-path" ,"url(#clip-"+WONumber)
                        .style("clip-path" ,"url(#clip-"+WONumber)
                        .attr("class" , function(d,i){ return "eventLabelLines eventLabelLine-"+i+"-"+WONumber; })
                        .attr("x1" , function(d,i){
                          return x( coPacking_parseDate(d["Date and Time"]) )
                        }) 
                        .attr("x2" , function(d,i){
                          return x( coPacking_parseDate(d["Date and Time"]) )
                        })  
                        .attr("y1" , y(0.5)) 
                        .attr("y2" , function(d,i){
                          if(i%2==0){ return y(0.7); }
                          else{ return y(0.3); }                          
                        }) 
                        .style("fill" , marsColors_secondary[WOcounter] )
                        .style("stroke" , marsColors_secondary[WOcounter] )
                        .style("stroke-width" , 1.5 );

        var eventLabelTextUpper  = focus.selectAll(".eventLabelTextUpper")
                        .data(dataForWorkOrder)
                        .enter()
                        .filter(function(d,i){
                          return (d["Transaction Type"]=="Used for production" || d["Transaction Type"]=="Line Clearance" );
                        })
                        .append("text")
                        .attr("clip-path" ,"url(#clip-"+WONumber)
                        .style("clip-path" ,"url(#clip-"+WONumber)
                        .attr("class" , function(d,i){ return "eventLabelTextUpper eventLabelTextUpper-"+i+"-"+WONumber; })
                        .attr("x" , function(d,i){ return x( coPacking_parseDate(d["Date and Time"]) ) }) 
                        .attr("y" , function(d,i){
                          if(i%2==0){ return y(0.75); }
                          else{ return y(0.25); }                          
                        })                         
                        .style("font-size" , "0.75rem" )
                        .style("font-weight" , "bold" )
                        .style("fill" , "#000000" )
                        .style("text-anchor", "middle")
                        .text(function(d,i){ return d["SSCC"] });


        var eventLabelTextLower  = focus.selectAll(".eventLabelTextLower")
                        .data(dataForWorkOrder)
                        .enter()
                        .filter(function(d,i){
                          return (d["Transaction Type"]=="Used for production" || d["Transaction Type"]=="Line Clearance" );
                        })
                        .append("text")
                        .attr("clip-path" ,"url(#clip-"+WONumber)
                        .style("clip-path" ,"url(#clip-"+WONumber)
                        .attr("class" , function(d,i){ return "eventLabelTextLower eventLabelTextLower-"+i+"-"+WONumber; })
                        .attr("x" , function(d,i){ return x( coPacking_parseDate(d["Date and Time"]) ) }) 
                        .attr("y" , function(d,i){
                          if(i%2==0){ return y(0.8); }
                          else{ return y(0.2); }                          
                        })                         
                        .style("font-size" , "0.75rem" )
                        .style("font-weight" , "normal" )
                        .style("fill" , "#000000" )
                        .style("text-anchor", "middle")
                        .text(function(d,i){ return d["Date and Time"]; });




        // append all circles to upper focus graph for d["Transaction Type"]=="Used for production" || d["Transaction Type"]=="Goods Receipt Finished Goods" based on submitted data ...
        var circularEvents = focus.selectAll(".focus_events")
          .data(dataForWorkOrder)
          .enter()
          .filter(function(d,i){
            return (d["Transaction Type"]=="Used for production" || d["Transaction Type"]=="Goods Receipt Finished Goods");
          })
          .append("circle")
            .attr("clip-path" ,"url(#clip-"+WONumber)
            .style("clip-path" ,"url(#clip-"+WONumber)
            .attr("class" , "focus_events circles deselected")
            .attr("cx" , function(d,i) {    return x( coPacking_parseDate(d["Date and Time"]) ); })
            .attr("cy" , function(d) { return y(0.5); })
            .attr("r" ,  function(d,i){
              if ( d["Transaction Type"]=="Used for production" ){ return 15; } 
              else if ( d["Transaction Type"]=="Goods Receipt Finished Goods" ){ return 5; } 
            })
            .style("fill" ,function(d,i){
              if ( d["Transaction Type"]=="Used for production" ){
                if( d.SSCC==ic.selectedSSCCs[WOcounter].SSCC ) { return marsColors_secondary[WOcounter]; }
                else{ return "#FFFFFF"; }             
              }
              else if ( d["Transaction Type"]=="Goods Receipt Finished Goods" ){ return "#FFFFFF"; }                
           })
          .style("stroke" , marsColors_secondary[WOcounter] )
          .style("stroke-width" , 2)
          .style("fill-opacity" , 0.75)
          .on('mouseover', function(d,i) {

            d3.select("#dialog-g-"+WONumber)
            .style("position" , "absolute")
            .style("left" , (d3.event.pageX+5)+"px")
            .style("top" ,  (d3.event.pageY+5)+"px")
            .style("display" , "inline" );

            d3.select("#itemCode-"+WONumber).text(d.Item);


            //call function build and display dialog shown when user hovers over WO transaction on upper graph 
            buildDialogTable(d);
          })
          .on('mousemove', function(d,i) {


            // move dialog as user moves cursor over selected symbols
            d3.select("#dialog-g-"+WONumber)
              .style("left" , (d3.event.pageX+5)+"px")
              .style("top" ,  (d3.event.pageY+5)+"px")

              return;
          })
          .on("mouseout" , function(d,i){ 

            // remove dialog when cursor leaves the selected symbol                    
            d3.selectAll(".dialog-g").style("display" , "none" );
            d3.selectAll(".dialogTable").remove();
            
            return;
          })
          .on("click" , function(d,i){

            // if user selects a transaction/event that is not already selected ...
            if( $(this).hasClass("deselected") ){


              // modify classnames of seleected symbol accordingly 
              $(this).removeClass("deselected").addClass("selected");


              // increase relevants counts by 1
              ic.selectedChildCount++;   
              ic_WOitemSelectionCounts[WONumber]++;                    


              // push data object onto global array (to be used later in "Summary Tab")
              ic.SummaryReport.push(d);                      


              // modify CSS attribution of selected symbol and equivalent symbol on lower context graph
              d3.select(this).style("fill" , marsColors_secondary[WOcounter] );
              d3.selectAll(".context_events.circles.WO" + WONumber + "-" + i).style("fill" , marsColors_secondary[WOcounter] );
            }
            else if( $(this).hasClass("selected") ){


              // modify classnames of seleected symbol accordingly 
              $(this).removeClass("selected").addClass("deselected");

          
              // decrease relevants counts by 1
              ic.selectedChildCount--;   
              ic_WOitemSelectionCounts[WONumber]--;  


              // modify CSS attribution of selected symbol and equivalent symbol on lower context graph
              d3.select(this).style("fill" , "#FFF" );
              d3.selectAll(".context_events.circles.WO" + WONumber + "-" + i).style( "fill" , "#FFF" );
            }


            // dynamcially update all relevant text labels that dsiplay count of selected child items
            d3.selectAll(".tablinks.new.WO"+WONumber).text("WO " + WONumber + " (" + ic_WOitemSelectionCounts[WONumber] + ")" );
            d3.select("#WOChildCount" + WONumber ).text(ic_WOitemSelectionCounts[WONumber] +" Children selected in WO " + WONumber );          
            d3.selectAll(".totalCountLabel").text(ic.selectedChildCount + " Children selected in total");


            return;
          });


        // append squares to upper focus graph for d["Transaction Type"]=="Waste for Production order" based on submitted data ...
        var squareEvents = focus.selectAll(".focus_events.squares")
                      .data(dataForWorkOrder)                   
                      .enter()
                      .filter(function(d,i){ return d["Transaction Type"]=="Waste for Production order"; })
                      .append("rect")
                      .attr("class" , "focus_events squares")                    
                      .attr("clip-path" ,"url(#clip-"+WONumber)
                      .style("clip-path" ,"url(#clip-"+WONumber)
                      .attr("x" , function(d) { return x( coPacking_parseDate(d["Date and Time"]) )-(ic.rectDimension/2);  })
                      .attr("y" , function(d) { return y(0.5)-(ic.rectDimension/2); })
                      .attr("width" , ic.rectDimension )
                      .attr("height" , ic.rectDimension )
                      .style("fill" ,function(d,i){ return "#FFFFFF"; })
                      .style("stroke" , marsColors_secondary[WOcounter] )
                      .style("stroke-width" , 2)
                      .style("fill-opacity" , 0.75);


        // append rotated square for d["Transaction Type"]=="Line Clearance" based on submitted data ...
        // append a group first to allow square to be rotated on the spot. 
/*        var squareEvents_g = focus.selectAll(".focus_events.g")
                                  .data(dataForWorkOrder)                   
                                  .enter()
                                  .filter(function(d,i){ return (d["Transaction Type"]=="Line Clearance") })
                                  .append("g")
                                  .attr("class" , function(d,i){ return "focus_events tt squares-g-"+i; })
                                  .attr("id" , function(d,i){ return "focus-squares-g-"+i+"-"+WONumber; })
                                  .attr("transform" , function(d,i){


                                    // append actual suqare to group element
                                    d3.select("#focus-squares-g-"+i+"-"+WONumber)
                                      .append("rect")
                                      .attr("x" , 0 )
                                      .attr("y" , 0 )


                                      .attr("width" , ic.rectDimension )
                                      .attr("height" , ic.rectDimension )
                                      .attr( "transform" , function(d,i){
                                        if( d["Transaction Type"]=="Line Clearance" ) {                 
                                          return "translate(" + -( Math.sqrt( 2*(ic.rectDimension**2) ) )/2 + "," + (0) + ") rotate(45)";
                                        }
                                      })
                                      .style("fill" ,function(d,i){                   
                                        if( d.SSCC==ic.selectedSSCCs[WOcounter].SSCC ) { return marsColors_secondary[WOcounter]; }
                                        else{ return "#FFF"; }  
                                      })
                                      .style("stroke" , marsColors_secondary[WOcounter] )
                                      .style("stroke-width" , 2)
                                      .style("fill-opacity" , 0.75);

                                    return "translate(" + (x( coPacking_parseDate(d["Date and Time"]))) + "," + (y(0.5)-( Math.sqrt( 2*(ic.rectDimension**2) ) )/2) + ")";
                                  });*/
        var ellipseEvents = focus.selectAll(".ellipseEvents")
                                  .data(dataForWorkOrder)                   
                                  .enter()
                                  .filter(function(d,i){ return (d["Transaction Type"]=="Line Clearance") })
                                  .append("ellipse")                                  
                                  .attr("clip-path" ,"url(#clip-"+WONumber)
                                  .style("clip-path" ,"url(#clip-"+WONumber)
                                  .attr("class" , "ellipseEvents focus_events ellipses")  
                                  .attr("cx", function(d,i){ return x( coPacking_parseDate(d["Date and Time"]) ) })
                                  .attr("cy", y(0.5) )
                                  .attr("rx", 10)
                                  .attr("ry", 25)
                                  .style("fill" ,function(d,i){                   
                                    if( d.SSCC==ic.selectedSSCCs[WOcounter].SSCC ) { return marsColors_secondary[WOcounter]; }
                                    else{ return "#00F"; }  
                                  })
                                  .style("stroke" , marsColors_secondary[WOcounter] )
                                  .style("stroke-width" , 2)
                                  .style("fill-opacity" , 0.75);






          // append equivalent circles to lower context graph to applow users to see full time history
          var circularEvents = context.selectAll(".context_events.circles")
                        .data(dataForWorkOrder)
                        .enter()
                        .filter(function(d,i){ return (d["Transaction Type"]=="Used for production" || d["Transaction Type"]=="Goods Receipt Finished Goods") })
                        .append("circle")

                      .attr("clip-path" ,"url(#clip-"+WONumber)
                      .style("clip-path" ,"url(#clip-"+WONumber)
                        .attr("class" , function(d,i){ return "context_events circles WO" + WONumber + "-" + i; })
                        .attr("cx" , function(d) { return x2( coPacking_parseDate(d["Date and Time"]) );  })
                        .attr("cy" , function(d) { return y2(0.5); })
                        .attr("r" ,  function(d,i){
                          if ( d["Transaction Type"]=="Used for production" ){ return 15; } 
                          else if ( d["Transaction Type"]=="Goods Receipt Finished Goods" ){ return 5; } 
                        })
                        .style("fill" ,function(d,i){
                          if ( d["Transaction Type"]=="Used for production" ){
                            if( d.SSCC==ic.selectedSSCCs[WOcounter].SSCC ) { return marsColors_secondary[WOcounter]; }
                            else{ return "#FFFFFF"; }             
                          }
                          else if ( d["Transaction Type"]=="Goods Receipt Finished Goods" ){ return "#FFFFFF"; }                
                        })
                        .style("stroke" , marsColors_secondary[WOcounter] )
                        .style("stroke-width" , 2)






          // append equivalent squares to lower context graph to applow users to see full time history
          var squareEvents = context.selectAll(".context_events.squares")
                        .data(dataForWorkOrder)                   
                        .enter()
                        .filter(function(d,i){ return d["Transaction Type"]=="Waste for Production order"; })
                        .append("rect")
                        .attr("class" , "context_events squares Waste")
                        .attr("x" , function(d) { return x2( coPacking_parseDate(d["Date and Time"]) )-(ic.rectDimension/2);  })
                        .attr("y" , function(d) { return y2(0.5)-(ic.rectDimension/2); })
                        .attr("width" , ic.rectDimension )
                        .attr("height" , ic.rectDimension )
                        .style("fill" ,function(d,i){ return "#FFFFFF"; })
                        .style("stroke" , marsColors_secondary[WOcounter] )
                        .style("stroke-width" , 2)
                        .style("fill-opacity" , 0.75);


          // append rotated square for d["Transaction Type"]=="Line Clearance" based on submitted data ...
          // append a group first to allow square to be rotated on the spot. 
          /*var squareEvents_g = context.selectAll(".context_events.g")
                                    .data(dataForWorkOrder)                   
                                    .enter()
                                    .filter(function(d,i){ return (d["Transaction Type"]=="Line Clearance") })
                                    .append("g")
                                    .attr("class" , function(d,i){ return "context_events clearance squares-g-"+i; })
                                    .attr("id" , function(d,i){ return "context-squares-g-"+i+"-"+WONumber; })
                                    .attr("transform" , function(d,i){


                                      // append actual suqare to group element
                                      d3.select("#context-squares-g-"+i+"-"+WONumber)
                                        .append("rect")
                                        .attr("x" , 0 )
                                        .attr("y" , 0 )
                                        .attr("width" , ic.rectDimension )
                                        .attr("height" , ic.rectDimension )
                                        .attr( "transform" , function(d,i){
                                          if( d["Transaction Type"]=="Line Clearance" ) {                 
                                            return "translate(" + -( Math.sqrt( 2*(ic.rectDimension**2) ) )/2 + "," + (0) + ") rotate(45)";
                                          }
                                        })
                                        .style("fill" ,function(d,i){                   
                                          if( d.SSCC==ic.selectedSSCCs[WOcounter].SSCC ) { return marsColors_secondary[WOcounter]; }
                                          else{ return "#FFF"; }  
                                        })
                                        .style("stroke" , marsColors_secondary[WOcounter] )
                                        .style("stroke-width" , 2)
                                        .style("fill-opacity" , 0.75);

                                      return "translate(" + (x2( coPacking_parseDate(d["Date and Time"]))) + "," + (y2(0.5)-( Math.sqrt( 2*(ic.rectDimension**2) ) )/2) + ")";
                                    });*/

        var ellipseEvents = context.selectAll(".ellipseEvents")
                                  .data(dataForWorkOrder)                   
                                  .enter()
                                  .filter(function(d,i){ return (d["Transaction Type"]=="Line Clearance") })
                                  .append("ellipse")                                  
                                  .attr("clip-path" ,"url(#clip-"+WONumber)
                                  .style("clip-path" ,"url(#clip-"+WONumber)
                                  .attr("class" , "ellipseEvents focus_events ellipses")  
                                  .attr("cx", function(d,i){ return x( coPacking_parseDate(d["Date and Time"]) ) })
                                  .attr("cy", y2(0.5) )
                                  .attr("rx", 10)
                                  .attr("ry", 25)
                                  .style("fill" ,function(d,i){                   
                                    if( d.SSCC==ic.selectedSSCCs[WOcounter].SSCC ) { return marsColors_secondary[WOcounter]; }
                                    else{ return "#00F"; }  
                                  })
                                  .style("stroke" , marsColors_secondary[WOcounter] )
                                  .style("stroke-width" , 2)
                                  .style("fill-opacity" , 0.75);


          // append x axis to lower context graph
          context.append("g")
              .attr("class", "axis axis--x")
              .attr("transform", "translate(0," + height2 + ")")
              .call(xAxis2);


          // append brush to lower context graph
          context.append("g")
              .attr("class", "brush")
              .call(brush)
              .call(brush.move, x.range());


          // bespokely modify particular element of brush to get fine-tuned look n feel.
          d3.selectAll(".handle").attr("rx", 5).attr("ry", 5)
          d3.selectAll(".axis.axis--y").selectAll(".tick").remove();
          d3.selectAll(".axis.axis--x3").selectAll(".tick").remove();
          d3.selectAll(".selection").attr("height", 124)
          

          



          /*
            FUNCTION NAME: brushed
            DESCRIPTION: function to handle interaction and changing of brush
            CALLED FROM: drawChart
            CALLS: 
            REQUIRES: n/a
            RETURNS: n/a
          */
          function brushed() {  

              if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;

              var s = d3.event.selection || x2.range();
              x.domain(s.map(x2.invert, x2));

              focus.selectAll(".focus_events.circles") .attr("cx" , function(d) { return x( coPacking_parseDate(d["Date and Time"]) );  });
              focus.selectAll(".focus_events.squares") .attr("x" , function(d) { return x( coPacking_parseDate(d["Date and Time"]) );  });
              focus.selectAll(".focus_events.tt").attr("transform" , function(d) { return "translate(" + (x( coPacking_parseDate(d["Date and Time"]))) + "," + (y(0.5)-( Math.sqrt( 2*(ic.rectDimension**2) ) )/2) + ")" });
              focus.selectAll(".eventLabelLines")
                        .attr("x1" , function(d,i){ return x( coPacking_parseDate(d["Date and Time"]) ) }) 
                        .attr("x2" , function(d,i){ return x( coPacking_parseDate(d["Date and Time"]) ) })  
              focus.selectAll(".eventLabelTextUpper")
                        .attr("x" , function(d,i){ return x( coPacking_parseDate(d["Date and Time"]) ) }) 
              focus.selectAll(".eventLabelTextLower")
                        .attr("x" , function(d,i){ return x( coPacking_parseDate(d["Date and Time"]) ) })


              focus.selectAll(".ellipseEvents")
                                  .attr("cx", function(d,i){ return x( coPacking_parseDate(d["Date and Time"]) ) })




              focus.select(".axis--x").call(xAxis);
              svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                  .scale((width-margin.left-margin.right) / (s[1] - s[0]))
                  .translate(-s[0], 0));

              return;

            }// end function brushed
              

              



            /*
              FUNCTION NAME: zoomed
              DESCRIPTION: function to handle effects of user using brush on context chart. Handles moving of symbols in upper focus chart
              CALLED FROM: drawChart
              CALLS: 
              REQUIRES: n/a
              RETURNS: n/a
            */
            function zoomed() {
                if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
                var t = d3.event.transform;
                x.domain(t.rescaleX(x2).domain());
                focus.select(".axis--x").call(xAxis);
                context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
            }

            return;

          }// end function drawChart() 