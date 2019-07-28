	
      /*
        FILENAME: script.js
        WRITTEN BY: JAMES BAYLISS (CONTRACTOR)
        TECHNOLOGIES: D3 (v4), JavaScript (ES5/6), JQuery (latest as at 2nd May 2019), Bootstrap (latest as at 2nd May 2019)
        WRITTEN BETWEEN: April 2019 to May 2019

        DESCRIPTION: function to create D3 focus-context graphs on Work Order tabs, plus related functionality
      */
            



      


	/*
	useful websites - 
	https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172
	*/


	/*

	TODOs/Bugs to fix
	- dialogs on diamonds and squares are not cropped when leacing 'focus' charting space
	- remove data object from global array (to be used later in "Summary Tab")
	- improve CSS styling or light/dark rows on Bulk table using Classnames, not iterating loops
	- summary graphs.
	- need to improve summary graphs to transition to summarise number of pallets/cases by location
	*/


	console.log("script.js")



	// initial variables 
	var ic = {}; // global namespace object for global vriables ('ic' = InfoSys Consulting) 
	ic.WOs_filtered = {}; // global object for storing filtered information for each successs considered work order
	ic.margin = { "top":25 , "bottom":25 , "left":25 , "right":25 }; // global margins defined for each main tab.
	ic.selectedSSCCs = []; // 2D array to contain the WO numbers selcted on the first bulk tab
	ic.allDonorItems = []; // 2D array to store information for donor items to list on individaul WO tabs
	ic.SummaryReport = []; // 2D array to contain content for summary report to list on final tab
	ic.columns = []; 
	ic.WO_VAI = []; // 2D to contain Value Added Information for each WO
	ic.rectDimension = 20; // dimension for plotted circles and squares on upper and lower charts
	ic.selectedChildCount=0; // counter to record number of child items selects
	ic_WOitemSelectionCounts = {}; //object initialised to count the number of items/tranbsactions selected for each WO=O 

	var slideCounter = 0; // counter for slide being currently displayed
	var donorCounter = 0; // itertator  for number of donor pallets selected  displayed	
	var svgContainer; // global declaration of main svg container. Declared in drawMap() function

	// colour arrays declared to use in colourimtery of design
	var marsColors_primary = [ "#0000A0" , "#00D7B9" , "#FFDC00" , "#000000" , "#FFFFFF" ];
	var marsColors_secondary = [ "#00DCFA" , "#A6DB00" , "#9600FF" , "#FF32A0" , "#FF3C14" , "#FF8200" ];
	var marsColors_app = [ "#4A4A4A" , "#8B8B8B" , "#D0D0D0" ];


	// temporary declarations for sceanrio being represented by visual. 
	// same values as used on Cristina's PPTx v3
	const Material = "NR371";
	const MGBC = "906A1NLD06";




/*


	function submitForm(){

		loadData();

		return;

	}// end function submitForm()

*/
            



      /*
        FUNCTION NAME: loadData
        DESCRIPTION: function called by HTML <body> tag in  index.html (Line 14) to hard load scenario data. Uses D3.queue fucntion to read fully each CSV data file in turn before calling next logical function to build visual 
        CALLED FROM: HTML <body> tag in  index.html (Line 14). Input files are those provided by Cristina Tasker during co-packing exercise.
        CALLS: ready
        REQUIRES: n/a
        RETURNS: n/a
      */
      function loadData(){


      		// call d3.queue to sequentially load all data fiels for data scenario search
      		/*
      		Search
			Item NR371 
			MGBC 906A1NLD06 
			SSCC 387199001527776510
		*/
		queue()
		    .defer(d3.csv, "data/PalletTraceabilityReport.csv") // content of 'Pallet Traceability Report' tab in file Multi Pallet Data Scenario.xlsx
		    .defer(d3.csv, "data/WorkOrders.csv") // content of 'Work Orders' tab in file Multi Pallet Data Scenario.xlsx
		    .defer(d3.csv, "data/WO59285.csv") // content of ' WO59285' tab in file Multi Pallet Data Scenario.xlsx
		    .defer(d3.csv, "data/WO59289.csv") // content of ' WO59289' tab in file Multi Pallet Data Scenario.xlsx
		    .defer(d3.csv, "data/WO59290.csv") // content of 'WO59290' tab in file Multi Pallet Data Scenario.xlsx
		    .defer(d3.csv, "data/WO59295.csv") // content of 'WO59295' tab in file Multi Pallet Data Scenario.xlsx
		    .defer(d3.csv, "data/WO59298.csv") // content of 'WO59298' tab in file Multi Pallet Data Scenario.xlsx
		    .defer(d3.csv, "data/Transactions.csv") // content of 'Transactions' tab in file Multi Pallet Data Scenario.xlsx
		    .await(ready); // call to ready() function to continue build of visual. only called once all CSVs are loaded in to memory  

		return;


	}// end function loadData()
            



      /*
        FUNCTION NAME: ready
        DESCRIPTION: function called by loadData() once all data files are sequentially loaded. Stores each local data object variable as a 'ic' namespaced global variable.
        CALLED FROM: HTML <body> tag in  index.html (Line 14). Input files are those provided by Cristina Tasker during co-packing exercise.
        CALLS: n/a
        REQUIRES: n/a
        RETURNS: n/a
      */
      function ready(error, PalletTraceabilityReport, WorkOrders, WO59285, WO59289, WO59290, WO59295, WO59298, Transactions ) {


      		// initial on load D3 error checking
  		if (error) throw error; 


  		// store all data ingested iun loadData as global namespaced objects.
  		ic.PalletTraceabilityReport = PalletTraceabilityReport;
  		ic.WorkOrders = WorkOrders;
		ic.WOs = {
				'WO59285' : WO59285,
				'WO59289' : WO59289,
				'WO59290' : WO59290,
				'WO59295' : WO59295,
				'WO59298' : WO59298
			};
		

		return;


	}// end function ready()
            



      	/*
        FUNCTION NAME: ready
        DESCRIPTION: function called by loadData() to remove all screen content except Bulk Tab to replicate Hold Initiator user return back to first tag to start over
        CALLED FROM: index.html
        CALLS: openTab
        REQUIRES: n/a
        RETURNS: n/a
     	*/
      	function returnToStart(){


      		// remove all tabs that have been added dynamically .. denoted by classname 'name'. Not this is is ALL Tabs except the Bulk tab
		d3.selectAll(".tablinks.new").remove();
		d3.selectAll(".tabcontent.new").remove();


		// function called to open desired Bulk Tab to replicate scenario change
		openTab(event, "Bulk");
		

		// reset and reinitialise all relevant count and data store variables originally initiated at head on script.js file
		slideCounter = 0;
		donorCounter = 0;
		ic = {};
		ic.WOs_filtered = {};
		ic.selectedSSCCs = [];


		// initialie all checkboxes on Bulk Tab view
		$(".checkbox").removeClass("checked").addClass("unchecked");
		$(".checkbox").prop("checked" , false);


		// store locally all row DOM table items on Bulk tab to allow modifying of CSS styling back to default dark-light alternating view.		
		var rows = d3.selectAll(".tableRow.Row")._groups[0];


		// iterate over 'rows' varaible to reset row stylign to  default dark-light alternating view.		
		rows.forEach(function(d,i){


			// localise individual row
			var index = d.className.replace("tableRow Row item-",'');


			// select that individual row
			d3.selectAll(".tableRow.Row.item-"+index).style("background-color" , function(){


				// modify CSS styling accordingly
				if(index % 2 === 0){ return "#FFFFFF"; }
				else { return "#dddddd"; }
			})
		})


		return;


	}// end function returnToStart
            



      	/*
        FUNCTION NAME: changeView
        DESCRIPTION: function called by 'Next' Buttons in index.html. Defines whiich functions to call to build the necessary Tab 
        CALLED FROM: index.html
        CALLS: 	openTab
        	populateSSCCList
        	drawMap
        	showSummary
        REQUIRES: n/a
        RETURNS: n/a
      	*/
      	function changeView(){


      		// increase counter variable for slide/tab being viewed.
		slideCounter++;


		// entering Bulk Tab view ... 
  		if( slideCounter==1 ){


  			// select previous slide/tab and hide it
	  		d3.selectAll( ".slide"+(parseInt(slideCounter-1)) ).style( "display" , "none" );   	


  			// select next slide/tab and display it
	  		d3.selectAll( ".slide"+slideCounter ).style( "display" , "inline" );


	  		// call function necesssary to build new Tab content
	  		openTab(event, 'Bulk');
	  		populateSSCCList("Bulk");
  		}


		// entering Process Map Tab view ... 
  		else if( slideCounter==2 ){   	


  			// select next slide/tab and display it
	  		d3.selectAll(".totalCountLabel").style("display" , "inline")


	  		// build new tab
			d3.selectAll(".tab")
				.append("button")
				.attr("class" , "tablinks Map new")
				.text("Work Order Process Map")
				.on("click" , function(){ openTab(event, "Map"); }); 

			
			// build new DIV attached to new Tab. this contains tab content
			d3.selectAll(".tabContainer")
				.append("div")
				.attr("class" , "tabcontent new")
				.attr("id" , "Map")
				.style("height" , "1050px")
				.style("overflow" , "auto");	


	  		// call function necesssary to build new Tab content
	  		openTab(event, 'Map');
	  		drawMap();
  		}


		// entering Summary List Tab view ... 
  		else if( slideCounter==3 ){ 


  			// select total counter label and hide it
	  		d3.selectAll(".totalCountLabel").style("display" , "none")


	  		// build new tab
			d3.selectAll(".tab")
				.append("button")
				.attr("class" , "tablinks new Summary")
				.text("Summary Statistics")
				.on("click" , function(){ openTab(event, "Summary"); }); 

			
			// build new DIV attached to new Tab. this contains tab content
			d3.selectAll(".tabContainer")
				.append("div")
				.attr("class" , "tabcontent new")
				.attr("id" , "Summary")
				.style("height" , "1050px")
				.style("overflow" , "auto");


			// change buttons displayed at lower right corner of screen
			d3.selectAll( ".buttonsBar1" ).style( "display" , "none" );
			d3.selectAll( ".buttonsBar2" ).style( "display" , "inline" );


	  		// call function necesssary to build new Tab content
	  		openTab(event, 'Summary');
	  		showSummary();

	  	}

		return;

	}// end function changeView();





	function drawSummaryCharts(width, height){


      		var PalletsByItem = d3.nest()
			.key(function(d) { return d["Child Item"]; })
			.rollup(function(leaves) {				
				return { "Quantity": d3.sum(leaves, function(d) {					
					return parseFloat(d["No of Pallets Produced"]);
				})}
			})
			.entries(ic.WO_VAI);

      		var CasesByItem = d3.nest()
			.key(function(d) { return d["Child Item"]; })
			.rollup(function(leaves) {				
				return { "Quantity": d3.sum(leaves, function(d) {					
					return parseFloat(d["Total Quantity Produced"]);
				})}
			})
			.entries(ic.WO_VAI);


/*
      		var PalletsByLocation = d3.nest()
			.key(function(d) { return d["Child Item"]; })
			.rollup(function(leaves) {				
				return { "No of Pallets Produced": d3.sum(leaves, function(d) {					
					return parseFloat(d["No of Pallets Produced"]);
				})}
			})
			.entries(ic.WO_VAI);

      		var CasesByLocation = d3.nest()
			.key(function(d) { return d["Child Item"]; })
			.rollup(function(leaves) {				
				return { "Total Quantity Produced": d3.sum(leaves, function(d) {					
					return parseFloat(d["Total Quantity Produced"]);
				})}
			})
			.entries(ic.WO_VAI);
*/



		// append SVG panel to DIV Tab. modify CSS heght and color of SVG. USed to store counts of cases/pallets by Item/location code
		d3.select( "#Summary").append("svg").attr("id" , "summary-svg") .attr( "width" , width).attr( "height" , 400).style("background-color" , "#FFFFFF")
		var datas =  [ PalletsByItem, CasesByItem ];

		// set the dimensions and margins of the graph
		var margin = [

				{ top: 35, right: 50, bottom: 50, left: 50 },
				{ top: 35, right: 50, bottom: 50, left: 50 }
			];

		var yAxisLabels = ["Items" , "Items"];
		var xAxisLabels = ["Number of Pallets" , "Number of Cases"];

		datas.forEach(function(d,i){

			var data = d;


			console.log(data)

			data.sort(function(x, y){
				console.log(x)
			   return d3.ascending(x.value.Quantity, y.value.Quantity);
			})

			console.log(data)

			// set the ranges
			var y = d3.scaleBand().range([400-margin[i].top-margin[i].bottom, 0]).padding(0.1);
			var x = d3.scaleLinear().range([0, width/2-margin[i].left-margin[i].right]);
			          
			// append the svg object to the body of the page append a 'group' element to 'svg'  moves the 'group' element to the top left margin
			var svg = d3.select("#summary-svg")
				.append("g")
				.attr("class", "g-"+i)
				.attr("transform", "translate(" + (50+(i*(width/2))) + "," + margin[i].top + ")");

			  // format the data
			  data.forEach(function(d) { d["Quantity"] = +d.value["Quantity"]; });

			  // Scale the range of the data in the domains
			  x.domain([0,  Math.ceil(d3.max(data, function(d){ return d["Quantity"]; }) / 10) * 10    ])
			  y.domain(data.map(function(d) { return d.key; }));
			
			  // append the rectangles for the bar chart
			  svg.selectAll(".bar")
			      .data(data)
			    .enter()
			    	.append("rect")
			      .attr("class", "bar")
			      .attr("width", function(d) {return x(d["Quantity"]); } )
			      .attr("y", function(d) { return y(d.key); })
			      .attr("height", y.bandwidth());


			  // add the x Axis
			  svg.append("g")
			  	.attr("class" , "x axis")
				.attr("transform", "translate(0," + (400-margin[i].top-margin[i].bottom) + ")")
				.call(d3.axisBottom(x));


			  // add the y Axis
			  svg.append("g").call(d3.axisLeft(y));
			  svg.append("text").text(yAxisLabels[i]).attr("x" , 0).attr("y" , -5).style("font-size" ,"1.0rem").style("fill" ,"#000").style("text-anchor" ,"start")
			  svg.append("text").text(xAxisLabels[i]).attr("x" , width/2-margin[i].left-margin[i].right).attr("y" , y.range()[0]-5).style("font-size" ,"1.0rem").style("fill" ,"#000").style("text-anchor" ,"end")


		})

		return;

	}// function drawSummaryCharts() 
            



      	/*
        FUNCTION NAME: showSummary
        DESCRIPTION: function called to construct "Summary List" tab view content.
        CALLED FROM: changeView
        CALLS: populateSSCCList
        REQUIRES: n/a
        RETURNS: n/a
      	*/
      	function showSummary(){


      		// retrieve current dimensions of SUmmary Tab and store as local variables. 
		var tabWidth = d3.select( "#Summary" ).style( "width" ).replace("px",'');
		var tabHeight = d3.select( "#Summary" ).style( "height" ).replace("px",'');


	        // call function to draw summary charts at head of work order
	      	drawSummaryCharts(tabWidth , tabHeight);


		// local array of table field names 
		var columns = [ "Item" , "Item Description" , "MGBC" , "SSCC" , "Local Pallet ID" , "BBD" , "Consumed Quantity" , "UOM" , "Work Order No." , "Work Order Status" ];


		// append summary table to summary DIV
		d3.select( "#Summary").append( "table" ).attr( "class" , "summaryTable" ).attr( "id" , "summaryTable" );


		// append table header row to table DOM item
		d3.selectAll(".summaryTable" )
			.append("thead")
			.append("tr")
			.attr("class" , "summaryTable-tableRow-headers headers" )


		// for each element in columns arraay, append table data cell and printer header label
		columns.forEach(function(d,i){
			d3.selectAll(".summaryTable-tableRow-headers").append("td").attr("class", "summaryTable-headers").text(d);
		});


		// append table body to table DOM item  
		d3.selectAll( ".summaryTable" )
			.append("tbody")
			.attr("class" , "summaryTable-tbody" )


		// iteratie through object containing all donor items (parent pallets)
		ic.allDonorItems.forEach(function(d,i){
	  		

	  		// locally store individual item 
	  		var item = d;


	  		// filter for Work Order Value added infrmation
	  		var VAItoUse = ic.WO_VAI.filter(function(d,i){
	  			return item["Work Order No."] == d["Work Order No"]
	  		})


	  		// append a new row to table body. Modify classname declaration and hence CSS attribution based on whether WO is in progress (red abckgrounf and white bold texdt) or completed (default CSS syling) 
	  		d3.selectAll(".summaryTable-tbody" )
				.append("tr")
				.attr("class" , function(){
					if( VAItoUse[0]["Status"]=="In Progress" ){ return "inProgress summaryTable-Row summaryTable-Row-item-"+i }
					else { return "summaryTable-Row summaryTable-Row-item-"+i }
				})


			// append a new table data cell and uopdate with content stored in WO_VAI baed on field header.
			columns.forEach(function(d){
				var col = d;
				d3.selectAll(".summaryTable-Row-item-"+i ).append("td").attr("class", "summaryTable-fillers").text(function(){
					
					switch (d) {
					  case "Item": return item.Item;
					    break;
					  case "Item Description": return item["Item Description"];
					    break;
					 case "MGBC": return item["MGBC"];
					    break;
					  case "SSCC": return item["SSCC"];
					    break;
					  case "Local Pallet ID":  return item["Local Pallet ID"];
					    break;
					  case "BBD": return item["BBD"];
					    break;
					  case "Consumed Quantity": return item["Quantity"];
					    break;
					  case "UOM": return item["UOM"];
					    break;
					  case "Work Order No.": return item["Work Order No."];
					    break;
					  case "Work Order Status": return VAItoUse[0]["Status"] ;
					    break;
					};
				})
			})
		});


		// call function to popularte main list of child items selected by user on individual WO tabs.
		// Passed a text string to defein from which function it is called from, as same fiucntion is used to build Bulk and Syunnary List tabs.
		populateSSCCList("Summary")


		return;


	}// end function showSummary() 
            



      	/*
        FUNCTION NAME: buildWorkOrderTabs
        DESCRIPTION: function called to iteratively build bespoke colour coded WO tabs.
        CALLED FROM: drawMap
        CALLS: 	addTopRightInformation
        	addTopLeftInformation
        	drawChart
        REQUIRES: 	WONumber - Unique WO order
        		i - WO count iterator (numeic integer) 
        		dataForWorkOrder - data object containing data relating to specific work order being considered when build new Tab
        RETURNS: n/a
      	*/
      	function buildWorkOrderTabs(WONumber, i, dataForWorkOrder){


      		// define body width for tab
		var bodyWidth = $("body").width()*0.90;	


		// initiate WO counter variable (JSON object with WO numbes as Keys), to store number of items selected by user for each WO
		ic_WOitemSelectionCounts[WONumber] = 0;


		// append new colour coded Tab div
		d3.selectAll(".tab")
			.append("button")
			.attr("class" , "tablinks new" + " WO" + WONumber)
			.text("WO " + WONumber + " ("+(0)+")")
			.style("background-color" ,  marsColors_secondary[i] )
			.on("click" , function(){ openTab(event, "WO" + WONumber); }); 


		// append new DIV to contain main content of WO
		d3.selectAll(".tabContainer")
			.append("div")
			.attr("class" , "tabcontent new")
			.attr("id" , "WO" + WONumber)
			.style("height" , "1050px")
			.style("overflow" , "auto");


		// append new DIV to upper left corner to contain WO summary information 
		d3.select("#WO"+WONumber)
			.append("div")
			.attr("class" , "upperLeft-" + WONumber)
			.style("float" , "left" )
			.style("width" , "50%")
			.style("height" , "33.3%");


		// append new DIV to upper right corner to contain WO Donor items information 
		d3.select("#WO"+WONumber)
			.append("div")
			.attr("class" , "upperRight-" + WONumber)
			.style("float" , "right" )
			.style("width" , "50%")
			.style("height" , "33.3%");


		// append new DIV to lower half of main DIV WO visual interactive content  
		d3.select("#WO"+WONumber)
			.append("div")
			.attr("class" , "lower-" + WONumber)
			.attr("id" , "lower-" + WONumber)
			.style("float" , "left" )
			.style("width" , "100%")
			.style("height" , "66.6%")
			.style("background-color" , "#FFFFFF");	   


		// append new SVG to lower half of main DIV WO visual interactive content  
		d3.selectAll(".lower-" + WONumber)
			.append("svg")
			.attr("class" , "svg-lower-" + WONumber)
			.attr("id" , "svg-lower-" + WONumber)
			.attr("width" ,bodyWidth )
			.attr("height" , 650);


		// call functions to add content to each of the three compoment divs attached above.
		addTopRightInformation(WONumber, i, dataForWorkOrder);
		addTopLeftInformation(WONumber, i, dataForWorkOrder);
		drawChart(WONumber, i, dataForWorkOrder, bodyWidth);


		return;


	}// end function buildWorkOrderTabs()
            



      	/*
        FUNCTION NAME: addTopRightInformation
        DESCRIPTION: function called to add content to upper right DIV information table
        CALLED FROM: buildWorkOrderTabs
        CALLS: 	n/a
        REQUIRES: 	WONumber - Unique WO order
        		i - WO count iterator (numeic integer) 
        		dataForWorkOrder - data object containing data relating to specific work order being considered when build new Tab
        RETURNS: n/a
      	*/
      	function addTopRightInformation(WONumber, i, dataForWorkOrder){


      		// define and locally store dimensions of Map Tab Div
		var tabWidth = d3.select( "#Map" ).style( "width" ).replace("px",'');
		var tabHeight = d3.select( "#Map" ).style( "height" ).replace("px",'');


		// append static donor items label
		d3.selectAll( ".upperRight-" + WONumber)
			.append( "label" )
			.attr( "class" , "DonorItemLabel" )
			.style("left" , (0)+"px" )
			.style("top" , (ic.margin.top)+"px" )
			.style("text-anchor" , "start" )
			.style("font-weight" , "bold" )
			.style("font-size" , "1.5rem" )
			.text( "Donor Item(s)" );


		// filter work order information for cases that have sceanrio SSCC anbd correct transaction type
		var donorItems = dataForWorkOrder.filter(function(d,i){
			return d.Item==Material && d.SSCC=="387199001527776510" && d["Transaction Type"]=="Used for production";
		})


		// extract column nbame infomration
		donorItems[0]["Work Order No."] = WONumber;
		var columns = d3.keys(donorItems[0])
		ic.allDonorItems = ic.allDonorItems.concat(donorItems);


		// append new table to DIV
		d3.selectAll( ".upperRight-" + WONumber).append( "table" ).attr( "class" , "WODonorInformationTable WODonorInformationTable-"+WONumber ).attr( "id" , "WODonorInformationTable-"+WONumber );


		// append table header row to table DOM object
		d3.selectAll(".WODonorInformationTable.WODonorInformationTable-"+WONumber )
			.append("thead")
			.append("tr")
			.attr("class" , "DonorInformation tableRow headers-"+WONumber )


		// add new td cells to contain new column headers
		columns.forEach(function(d,i){
			d3.selectAll(".DonorInformation.tableRow.headers-"+WONumber).append("td").attr("class", "headers").text(d);
		});


		// append new table body to table DOM object
		d3.selectAll( ".WODonorInformationTable.WODonorInformationTable-"+WONumber )
			.append("tbody")
			.attr("class" , "tbody RH tbody-"+WONumber )



		// for each donor item ... 
		donorItems.forEach(function(d,i){
	  		

	  		// localise and save donoor item to avoid d item conflicts
	  		var item = d;


	  		// append table row
	  		d3.selectAll(".tbody.RH.tbody-"+WONumber )
				.append("tr")
				.attr("class" , "donorTableRow Row item-"+i+"-"+WONumber )


			// for each Key in item append new td cell and populate with information.
			for(var element in item){
				d3.selectAll(".donorTableRow.Row.item-"+i+"-"+WONumber ).append("td").attr("class", "fillers").text(item[element]);
			}
		})


		return;

	}// end function addTopLeftInformation()
            



      	/*
        FUNCTION NAME: addTopLeftInformation
        DESCRIPTION: function called to add content to upper left DIV information table
        CALLED FROM: buildWorkOrderTabs
        CALLS: 	n/a
        REQUIRES: 	WONumber - Unique WO order
        		i - WO count iterator (numeic integer) 
        		dataForWorkOrder - data object containing data relating to specific work order being considered when build new Tab
        RETURNS: n/a
      	*/
      	function addTopLeftInformation(WONumber, i, dataForWorkOrder){


      		// filetr wo_VAI object content for infomration relating to WO being considered
		var WO_VAI = ic.WorkOrders.filter(function(d,i){ return d["Work Order No"]==WONumber; })


		// buikld up global wo_VAI object with successive information  
		ic.WO_VAI = ic.WO_VAI.concat(WO_VAI);	


		// array containing tavble row headers
		var rowSubjects = [ "Status:" , "Line:" , "FG Item:" , "Description:" , "Start:" , "End:" , "Number of Pallets:" , "Quantity:" ];


		// append new table to upper left div
		d3.selectAll( ".upperLeft-" + WONumber).append( "table" ).attr( "class" , "WOinformationTable WOinformationTable-"+WONumber ).attr( "id" , "WOinformationTable-"+WONumber );


		// appen table bodyt to table DOM item
		d3.selectAll( ".WOinformationTable.WOinformationTable-"+WONumber )
			.append( "tbody" )
			.attr( "class" , "tbody LH tbody-"+WONumber );


		// for each element in array rowSubjects
		rowSubjects.forEach(function(d,i){


			// append ne table data row
	  		d3.selectAll(".tbody.LH.tbody-"+WONumber )
				.append("tr")
				.attr("class" , "infoTableRow Row item-"+i+"-"+WONumber);


			// append new table data cell (left hand column). populate accordingly with row title from rowSubjects
			d3.selectAll(".infoTableRow.Row.item-"+i+"-"+WONumber)
				.append("td")
				.attr("class", "infofillers")
				.style("color", function(){
					if( WO_VAI[0].Status=="In Progress" && d=="Status:" ){ return "#FFF"; }
					else{ return "#000"; }
				})
				.style("background-color", function(){
					if( WO_VAI[0].Status=="In Progress" && d=="Status:" ){ return "#F00"; }
					else{ return "#FFF"; }
				})
				.style("font-weight", function(){ return "bold"; })				
				.style("width", "50%")
				.text(rowSubjects[i]);


			// append new table data cell (right hand column). populate accordingly with content based on  row title from rowSubjects. CSS of some cells alterred according to row and contetn being considered.
			d3.selectAll(".infoTableRow.Row.item-"+i+"-"+WONumber).append("td")
				.style("color", function(){
					if( WO_VAI[0].Status=="In Progress" && d=="Status:" ){ return "#FFF"; }
					else{ return "#000"; }
				})
				.style("background-color", function(){
					if( WO_VAI[0].Status=="In Progress" && d=="Status:" ){ return "#F00"; }
					else{ return "#FFF"; }
				})
				
				.style("width", "50%")
				.attr("class", "infofillers")
				.text(function(){
				
				switch (d) {
				  case "Status:": return WO_VAI[0].Status;
				    break;
				  case "Line:": return WO_VAI[0].Line;
				    break;
				 case "FG Item:": return WO_VAI[0]["Child Item"];
				    break;
				  case "Description:": return WO_VAI[0]["Child Item Description"];
				    break;
				  case "Start:":  return WO_VAI[0]["Start"];
				    break;
				  case "End:": return WO_VAI[0]["End"];
				    break;
				  case "Number of Pallets:": return numberWithCommas(WO_VAI[0]["No of Pallets Produced"]);
				    break;
				  case "Quantity:": return numberWithCommas(WO_VAI[0]["Total Quantity Produced"]);
				    break;
				}
			});

		})


		return;


	}// end function  addTopLeftInformation
            



      	/*
        FUNCTION NAME: drawMap
        DESCRIPTION: function called to add content for process map (tab reached after selecting items on Bulk Tab)
        CALLED FROM: buildWorkOrderTabs
        CALLS: 	drawLegend
        	buildWorkOrderTabs
        	drawTag
        	openTab
        REQUIRES: n/a
        RETURNS: n/a
      	*/
      	function drawMap(){


      		// initialise local varaibles.
		var Child_Item;
		var filtered_data = [];


		// determine tab dimensions
		var tabWidth = d3.select( "#Map" ).style( "width" );
		var tabHeight = d3.select( "#Map").style( "height" );
 

 		// append main SVG panel to DIV to contain final process maps
		ic.svgContainer = d3.select( "#Map" )
			.append( "svg" )
			.attr( "class" , "svg-WOmap" )
			.attr( "id" , "svg-WOmap" )
			.attr( "width", tabWidth )
			.attr( "height", tabHeight )
			.style( "background-color" , "none" );


		// call function to draw legend content
		drawLegend(ic.svgContainer, "map");



		// store local variab le for necessary information
		const numberWOs = ic.selectedSSCCs.length;
		const WOverticalInterval = tabHeight.replace( "px" , '' )/(parseInt(ic.selectedSSCCs.length+1));


		// reset/imitialise WO counter
		var WOcounter = 0;
		const WOs_selected =  [];


		// push selced WO number onto local array
		ic.selectedSSCCs.forEach(function(d,i){
			WOs_selected.push(d["Work Order No"]);
		})


		// for each selected SSCC append new group element to SVG panel for attaching content onto 
		var WOGroups = ic.svgContainer.selectAll(".svg-WOmap-g")
						.data(ic.selectedSSCCs)
						.enter()
						.append( "g" )
						.attr( "class" , function(d,i){ return "svg-WOmap-g WO" + d["Work Order No"];  })
						.attr( "id" , function(d,i){ return "svg-WOmap-g-WO" + d["Work Order No"];  })
						.attr( "transform" ,  function(d,i){ return "translate(" + (tabWidth.replace("px",'')*0.25) + "," + parseFloat(WOverticalInterval+(i*WOverticalInterval)) + ")"; });


		// append colour coded line to unique g element 
		WOGroups.append( "line" )
				.attr( "class" , function(d,i){	 return "svg-WOmap-line svg-WOmap-line WO" + d["Work Order No"]; })
				.attr( "id" , function(d,i){ return "svg-WOmap-line-WO"+d["Work Order No"];  })
				.attr( "x1" , 0 )
				.attr( "x2" , tabWidth.replace("px",'')*0.6 )
				.attr( "y1" , 0 )
				.attr( "y2" , 0 )
				.style( "stroke-width" , 3 )
				.style( "fill" , function(d,i){ return marsColors_secondary[i]; })
				.style( "stroke" , function(d,i){ return marsColors_secondary[i]; })


		// append text label denoting WO number  
		WOGroups.append( "text" )					
				.attr( "x" , function(d,i){ return (d3.select("#svg-WOmap-line-WO"+d["Work Order No"]).attr("x2") - d3.select("#svg-WOmap-line-WO"+d["Work Order No"]).attr("x1")) /2; })
				.attr( "y" , 50 )
				.style( "fill" , function(d,i){ return marsColors_secondary[i]; })				
				.style( "font-weight" , "bold" )
				.style( "font-size" , "2.0rem" )
				.text(function(d,i){ return "WO" + d["Work Order No"]; })
				.on("click", function(){ openTab(event, d["Work Order No"]); });



		// for each work order
		WOs_selected.forEach(function(d,i){

			var WONumberToConsider = d;

			ic.WorkOrders.forEach(function(d,i){
				
				if( d["Work Order No"]==WONumberToConsider ){ Child_Item=d["Child Item"]; }
			 
				ic.WOs_filtered["WO"+WONumberToConsider] = ic.WOs["WO"+WONumberToConsider].filter(function(d,i){
					return d.Item == Material || d.Item == Child_Item;
				})
			});


			// call function to build work order tab content
			buildWorkOrderTabs(d, i , ic.WOs_filtered["WO"+WONumberToConsider]);		 
		});


		// for each item in filtered work ordr information
		for( var obj in ic.WOs_filtered ){


			// locally sotre information/item
			var WOevents = ic.WOs_filtered[obj];
			var numberEvents = WOevents.length-1;


			// calculate line length and interval size in pixel for placement on transactions along line
			var lineLength = d3.select("#svg-WOmap-line-"+obj).attr("x2") - d3.select("#svg-WOmap-line-"+obj).attr("x1");
			var interval = lineLength/numberEvents;


			//for each WO ... 
			WOevents.forEach(function(d,i){	


				// if transaction item is first or last item in WO, append a text label below the process line
				if( i==0 || i==numberEvents ){
					drawTag(WOcounter, i, obj, interval, d , "bottom", "end", numberEvents);
				}


				// if transaction item is '"Used for production" or "Goods Receipt Finished Goods" 
				if( d["Transaction Type"]=="Used for production" || d["Transaction Type"]=="Goods Receipt Finished Goods" ){


					// append circle element and style accordingly (radius and fill and stroke)
					d3.selectAll( ".svg-WOmap-g." + obj )
						.append( "circle" )
						.attr( "class" , "WOevent" )
						.attr( "cx" , i*interval)
						.attr( "cy" , 0)
						.attr( "r" , function(){
							if( d["Transaction Type"]=="Used for production" ){
								drawTag(WOcounter, i, obj, interval, d , "top", "middle", numberEvents);
								return 15;
							}
							else {  return 5; }						
						})
						.style( "fill" , function(){							
							if( d.SSCC==ic.selectedSSCCs[WOcounter].SSCC ) {
								drawTag(WOcounter, i, obj, interval, d , "top", "middle", numberEvents);
								return marsColors_secondary[WOcounter];
							}
							else{ return "#FFFFFF"; }
						})
						.style( "stroke" , marsColors_secondary[WOcounter] )
						.style( "stroke-width" , function(){ return 2; });
				}


				// if transaction item is '"Used for production" or "Waste for Production order"
				else if( d["Transaction Type"]=="Waste for Production order" ){


					// append rectangle to reflect "Waste for Production order"
					d3.selectAll( ".svg-WOmap-g." + obj )
						.append( "rect" )
						.attr( "class" , "WOevent" )
						.attr( "x" , (i*interval)-ic.rectDimension/2 )
						.attr( "y" , -ic.rectDimension/2 )
						.attr( "width" , ic.rectDimension )
						.attr( "height" , ic.rectDimension )
						.style( "fill" , function(){ return "#FFFFFF"; })
						.style( "stroke" , function(){ return marsColors_secondary[WOcounter]; })
						.style( "stroke-width" , function(){ return 2; });
						
						drawTag(WOcounter, i, obj, interval, d , "top", "middle", numberEvents);
								
				}


				// if transaction item is '"Used for production" or "Line Clearance"
				else if( d["Transaction Type"]=="Line Clearance" ){


					// append group element to process line . needed to attach a rotated rectangle to visual
					d3.selectAll( ".svg-WOmap-g." + obj )
						.append("g")
						.attr("transform" , "translate(" + (i*interval) + "," + (0) + ")" )
						.attr("class" , "g-"+obj)

					// append diamond (rotated rectangle) to process line. style accordingly
					d3.selectAll( ".g-" + obj )
						.append( "rect" )
						.attr( "class" , "WOevent" )
						.attr( "x" , 0 )
						.attr( "y" , -ic.rectDimension )
						.attr( "width" , ic.rectDimension )
						.attr( "height" , ic.rectDimension )
						.attr( "transform" , function(){
							if( d["Transaction Type"]=="Line Clearance – Selected SSCC" || d["Transaction Type"]=="Line Clearance" ) {								 
								return "translate(" + -( Math.sqrt( 2*(ic.rectDimension**2) ) )/2 + "," + (0) + ") rotate(45)";
							}
						})						
						.style( "fill" , function(){							
							if( d.SSCC==ic.selectedSSCCs[WOcounter].SSCC ) {
								drawTag(WOcounter, i, obj, interval, d , "top", "middle", numberEvents);
								return marsColors_secondary[WOcounter];
							}
							else{ return "#FFFFFF"; }
						})
						.style( "stroke" , function(){ return marsColors_secondary[WOcounter]; })
						.style( "stroke-width" , function(){ return 2; });

				}
			})


			// increasr WO counter by 1
			WOcounter++;
		}


		// select all WOEvents (transactions/items)( and rise to front		
		var sel = d3.selectAll(".WOevent");
		sel.moveToFront();		


		return;


	}// end function drawMap()
            



      	/*
        FUNCTION NAME: drawTag
        DESCRIPTION: function called to add content for process map (tab reached after selecting items on Bulk Tab)
        CALLED FROM: buildWorkOrderTabs
        CALLS: 	n/a
        REQUIRES: 	WOcounter - WO count iterator
        		i
        		obj
        		interval
        		d - WO transaction information
        		orientate - is label to be displayed above or below line 
        		step - is label at start/end or in middle of process line
        		numberEvents
        RETURNS: n/a
      	*/
      	function drawTag(WOcounter, i, obj, interval, d, orientate, step, numberEvents){


      		// varaible to base on which labelling goes in relation to process line
		var base = 0;


		// modify base based on 'oientate'
		if( orientate=="top" ){ base=-50; }
		else if( orientate=="bottom" ){ base=50; }


		// append new group element
		d3.selectAll( ".svg-WOmap-g." + obj )
			.append( "g" )
			.attr("transform" , "translate(" + (i*interval) + "," + (0) + ")" )
			.attr("class" , "txt-g-"+obj + "-" + i );


		// append new vertical line group element. modify if abovce or below line
		d3.selectAll( ".txt-g-"+obj + "-" + i )
			.append( "line" )
			.attr( "x1" , 0)
			.attr( "x2" , 0 )
			.attr( "y1" , 0 )
			.attr( "y2" , base )
			.attr( "y2" , function(){
				if( orientate=="bottom" ){ return 50; }
				else { 
					if(i%2==0){ return base; }
					else{ return base-50; }
				 }
			})
			.style( "fill" , marsColors_secondary[WOcounter] )
			.style( "stroke" , marsColors_secondary[WOcounter] )
			.style( "stroke-width" , function(){ return 2; });



		// append new text label to group element. modify if an odd or even count for label. attept to avoid clashing labels.
		// modify if labelling is a middle-of-process transction item
		if( step=="middle" ){


			// append transaction type label
			d3.selectAll( ".txt-g-"+obj + "-" + i )
				.append("text")			
				.attr( "x" , 0)
				.attr( "y" , function(){
					if(i%2==0){ return -60; }
					else{ return -110; }
				})
				.style( "fill" , function(d,i){ return "#4A4A4A"; })	
				.style( "font-weight" , "bold" )
				.style( "font-size" , "0.75rem" )
				.style( "text-anchor" , "middle" )
				.text(d["Transaction Type"]);	


			// append SSCC code label
			d3.selectAll( ".txt-g-"+obj + "-" + i )
				.append("text")			
				.attr( "x" , 0)
				.attr( "y" , function(){
					if(i%2==0){ return -75; }
					else{ return -125; }
				})				
				.style( "fill" , function(d,i){ return "#4A4A4A"; })
				.style( "font-weight" , "bold" )
				.style( "font-size" , "0.75rem" )
				.style( "text-anchor" , "middle" )
				.text(d["SSCC"]);


			// append date and time label
			d3.selectAll( ".txt-g-"+obj + "-" + i )
				.append("text")			
				.attr( "x" , 0)
				.attr( "y" , function(){
					if(i%2==0){ return -90; }
					else{ return -140; }
				})				
				
				.style( "fill" , function(d,i){ return "#4A4A4A"; })	
				.style( "font-weight" , "light" )
				.style( "font-size" , "0.75rem" )
				.style( "text-anchor" , "middle" )
				.text(d["Date and Time"]);
		}



		// append new text label to group element. modify if an odd or even count for label. attept to avoid clashing labels.
		// modify if labelling is a end-of-process transction item
		else if( step=="end" ){

			d3.selectAll( ".txt-g-"+obj + "-" + i )
				.append("text")			
				.attr( "x" , 0)
				.attr( "y" , 65 )
				.attr("dy", "0em")
				.style( "fill" , function(d,i){ return "#4A4A4A"; })	
				.style( "font-weight" , "light" )
				.style( "font-size" , "0.75rem" )
				.style( "text-anchor" , function(){
					if( i==0 ){ return "start"; } 
					else if( i==numberEvents ){ return "end"; } 
				})
				.text(d["Date and Time"]);

			d3.selectAll( ".txt-g-"+obj + "-" + i )
				.append("text")			
				.attr( "x" , 0)
				.attr( "y" , 65 )
				.attr("dy", "1.25em")
				.style( "fill" , function(d,i){ return "#4A4A4A"; })	
				.style( "font-weight" , "light" )
				.style( "font-size" , "0.75rem" )
				.style( "text-anchor" , function(){
					if( i==0 ){ return "start"; } 
					else if( i==numberEvents ){ return "end"; } 
				})
				.text(function(){
					if( i==0 ){ return "(WO Start)"; } 
					else if( i==numberEvents ){ return "(WO End)"; }  
				});
		}

		return;

	}// end function drawTag()
            



      	/*
        FUNCTION NAME: drawLegend
        DESCRIPTION: function called to build legends on individual WO and Process tabs 
        CALLED FROM: drawMap
     		   drawChart
        CALLS: 	n/a
	REQUIRES: 	src - where was fucntion called from 
			WO - 
        RETURNS: n/a
      	*/
      	function drawLegend(src, WO){


      		// initial array of all process items labels.
		var legendItem = [ "Used for production" , "Used for production – Selected SSCC" , "Goods Receipt Finished Goods" , "Line Clearance" , "Line Clearance – Selected SSCC" , "Waste for Production order" ];
		var mapLegend;


		// // append new group element to mapLegend item
		mapLegend = src.append( "g" )
			.attr("class" , "map-legend-g-"+WO )
			.attr("id" , "map-legend-g" )
			.attr("transform" , function(){	
				if( WO=="map" ){ return "translate(" + (0) + "," + (d3.select( "#Map" ).style( "height" ).replace("px",'')/3) + ")"; }
				else { return "translate(" + (ic.margin.left) + "," + (d3.select( "#svg-lower-"+WO ).attr( "height" )/4) + ")"; }
			});


		// for each Leged item
		legendItem.forEach(function(d,i){


			// append new group item to mapLegend base
			mapLegend.append( "g" )
				.attr("transform" , "translate(" + ic.margin.left + "," + (50+((ic.margin.top*2)*i)) + ")" )
				.attr( "class" , "mapLegendItem-g-"+WO )
				.attr( "id" , "mapLegendItem-bg"+i+"-"+WO );			


			// append new group item warrants a circle suymbol to be drawn
			if( i==0 || i==1 || i==2 ){

				d3.select("#mapLegendItem-bg"+i+"-"+WO )
					.append( "circle" )
					.attr( "cx" , 0)
					.attr( "cy" , 0)
					.attr( "r" , function(){
						if( d=="Used for production" || d=="Used for production – Selected SSCC" ){ return 10; }
						else {  return 5; }						
					})
					.style( "fill" , function(){
						if( d=="Used for production – Selected SSCC" ){ return "#4A4A4A"; }
						else { return "white"; }
					})
					.style( "stroke" , function(){ return "#4A4A4A"; })
					.style( "stroke-width" , function(){ return 2; });
			}

			// else draw a rectangle/diamond for the element
			else{

				d3.select("#mapLegendItem-bg"+i+"-"+WO )
					.append( "rect" )
					.attr( "x" , -ic.rectDimension/2 )
					.attr( "y" , -ic.rectDimension )
					.attr( "width" , ic.rectDimension )
					.attr( "height" , ic.rectDimension )
					.attr( "transform" , function(){
						if( d=="Line Clearance – Selected SSCC" || d=="Line Clearance" ) {
							return "translate(" + (-ic.rectDimension/2) + "," + (0) + ") rotate(45)";
						}
					})
					.style( "fill" , function(){
						if( d=="Line Clearance – Selected SSCC" ){ return "#4A4A4A"; }
						else { return "white"; }
					})
					.style( "stroke" , function(){ return "#4A4A4A"; })
					.style( "stroke-width" , function(){ return 2; });
			}


			// append text label
			d3.select("#mapLegendItem-bg"+i+"-"+WO )
				.append( "text" )
				.attr( "x" , ic.margin.left )
				.attr( "y" , 0 )
				.style( "font-weight" , 650 )
				.style( "font-size" , "0.75rem" )
				.text(d);
		})


		return;


	}// end function drawLegend
            



      	/*
        FUNCTION NAME: openTab
        DESCRIPTION: function called to display and hide tabs based on user selection
        CALLED FROM: any tab button in index.html plus when user presses Nxxt button.
        CALLS: 	n/a
	REQUIRES: 	evt - 
			tabName - defines which tab is active now and to display
        RETURNS: n/a
      	*/
      	function openTab(evt, tabName) {


      		// initialise local variables. 
		var i, tabcontent, tablinks;
		tabcontent = document.getElementsByClassName("tabcontent");
		

		// hide all tabs
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}


		// make active and visible the required current tab selected by user
		tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
		}
		

		// display block required tab
		document.getElementById(tabName).style.display = "block";
		// console.log(tabName)
		// evt.currentTarget.className += " active";

		/* d3.selectAll(".tablinks").style( "background-color"  , "#FFFFFF")
		d3.selectAll(".tablinks."+tabName).style( "background-color"  , "#D8D8D8")*/


		// modify classnames accordinfgly
		$(".tablinks").removeClass( "active" )
		$(".tablinks."+tabName).addClass( "active" );


		// modify CSS styling of view
		d3.selectAll(".container").style( "background-color"  , "#FFFFFF")
		d3.selectAll("body").style( "background-color"  , "#FFFFFF")


		return;


	}// end function openTab
            



      	/*
        FUNCTION NAME: populateSSCCList
        DESCRIPTION: function called to populate tables on Bulk and Summary List tabs
        CALLED FROM: 	changeView
        		showSummary
        CALLS: 	n/a
	REQUIRES: 	src
        RETURNS: n/a
      	*/
      	function populateSSCCList(src){
		

		// initialise local data variable
		var data = [];


		// append new header row to table body
		d3.selectAll(".table-"+src)
			.append("thead")
			.append("tr")
			.attr("class" , "tableRow headers-"+src)


		// if Bulk table is being built
		if ( src=="Bulk" ) {


			// isolate columns array in PalletTraceabilityReport data table
			ic.columns = ic.PalletTraceabilityReport.columns;
			ic.columns.splice(0, 0, "");


			// add new td cell and populate with column header 
			ic.columns.forEach(function(d,i){
				d3.selectAll(".tableRow.headers-"+src).append("th").attr("class", "headers").text(d);
			});


			// locally store relevant data
			data = ic.PalletTraceabilityReport;
		}


		// if Summary table is being built
		else if ( src=="Summary" ) {


			// append new tabel to summary list div
			d3.select( "#Summary" ).append( "table" ).attr( "class" , "table-"+src )


			// append new tavble header row to table body
			d3.selectAll(".table-"+src)
				.append("thead")
				.append("tr")
				.attr("class" , "tableRow headers-"+src)
			

			// append new data cell to table row
			ic.columns.forEach(function(d,i){
				d3.selectAll(".tableRow.headers-"+src).append("th").attr("class", "headers").text(d);
			});


			// foreach item in PalletTraceabilityReport data table
			ic.PalletTraceabilityReport.forEach(function(d,i){


				// isolate and localise each data item
				var bulk_item =d;


				// for each item in summary table
				ic.SummaryReport.forEach(function(d,i){


					// picked item is item selected by user on WO tab. stored locally 
					var picked_item = d;

					//  bulk
					// Item	Item Description	MGBC	SSCC	Local Pallet ID	BBD
					if( bulk_item["Item"]==picked_item["Item"] &&
					    bulk_item["Item Description"]==picked_item["Item Description"] &&
					    bulk_item["MGBC"]==picked_item["MGBC"] && 
					    bulk_item["SSCC"]==picked_item["SSCC"] && 
					    bulk_item["Local Pallet ID"]==picked_item["Local Pallet ID"] && 
					    bulk_item["BBD"]==picked_item["BBD"] ){

						// push bulk item onto array
					    	data.push(bulk_item);
					}

				})
			})
		}
		else{

		}


		// append a new table body to item
		d3.selectAll(".table-"+src)
			.append("tbody")
			.attr("class" , "tbody-"+src);


		// for each item in data array 
		data.forEach(function(d,i){
	  		

	  		// isolate and localise data item
	  		var item = d;


	  		// append  dat table row
	  		d3.selectAll(".tbody-"+src)
				.append("tr")
				.attr("class" , "tableRow Row item-"+i+"-"+src)


			// if its a Bulk item append a new checkbox
			if ( src=="Bulk" ) {
				d3.selectAll(".tableRow.Row.item-"+i+"-"+src)
					.append("input")
					.attr("class", "checkbox unchecked")
					.attr("id", "checkbox-"+i)
					.attr("type", "checkbox")
					.on("click", function(){

						
						if(this.checked==true){

							 
							if(donorCounter<marsColors_secondary.length){
								d3.select(".tableRow.Row.item-"+i+"-"+src).style("background-color", marsColors_secondary[donorCounter]);
								$("#checkbox-"+i).removeClass("unchecked").addClass("checked");							
								ic.selectedSSCCs.push(ic.PalletTraceabilityReport[i])
								donorCounter++;
							}
							if(donorCounter==marsColors_secondary.length){
								//d3.selectAll(".checkbox.unchecked").attr("disabled" , true)
							}					
						}
						else if(this.checked==false){

							 
							if(i%2==0){ d3.select(".tableRow.Row.item-"+i+"-"+src).style("background-color", "#FFFFFF"); }
							else{ d3.select(".tableRow.Row.item-"+i+"-"+src).style("background-color", "#dddddd"); }
							donorCounter--;						
						}


						if( donorCounter!=0 ){
							//$(".btn.btn-info.slide1").removeClass("disabled");
							//d3.selectAll(".btn.btn-info.slide1").attr("disabled" , false)
						}
						else{
							//$(".btn.btn-info.slide1").addClass("disabled");
							//d3.selectAll(".btn.btn-info.slide1").attr("disabled" , true)
						}
					});
			}// end if ... 

			// otherwise just add a staic row counter
			else{
				d3.selectAll(".tableRow.Row.item-"+i+"-"+src).append("th").attr("class", "fillers").text( parseInt(i+1) );
			}


			// for current row, add and populate data cells with information.
			for(var element in item){
				d3.selectAll(".tableRow.Row.item-"+i+"-"+src)
					.append("th")
					.attr("class", "fillers")
					.style("color", function(){ if( item[element]==387199001527776510) { return "#F00"; } })
					.text(item[element]);
			}
		}); 

		return;

	}// end function populateSSCCList()