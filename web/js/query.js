//Options for the toast notifications
toastr.options.closeButton = true;
toastr.options.showMethod = 'slideDown'; 
toastr.options.hideMethod = 'slideUp'; 
toastr.options.positionClass = 'toast-bottom-left'

//Chart generation function
function respChart(selector, data) {

    var option = {
        scaleOverlay: false,
        scaleOverride: false,
        scaleSteps: null,
        scaleStepWidth: null,
        scaleStartValue: null,
        scaleLineColor: "rgba(0,0,0,.1)",
        scaleLineWidth: 1,
        scaleShowLabels: true,
        scaleLabel: "<%=value%>",
        scaleFontFamily: "arial",
        scaleFontSize: 10,
        scaleFontStyle: "normal",
        scaleFontColor: "#909090",
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        bezierCurve: true,
        pointDot: true,
        pointDotRadius: 3,
        pointDotStrokeWidth: 1,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true,
        animation: true,
        animationSteps: 60,
        animationEasing: "easeOutQuart",
        onAnimationComplete: null,
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
    }

    var ctx = selector.get(0).getContext("2d");

    var container = $(selector).parent();


    $(window).resize(generateChart);

	function generateChart() {

        var ww = selector.attr('width', $(container).width());
        var hh = selector.attr('height', $(container).height());
        new Chart(ctx).Line(data, option);
    };

    generateChart();
}

//Get selection and display chart
function getSelection () {

	if (firstSelection) {
		//Check if first date selected
		error = true;
		beforeDate.css("border", "3px solid rgb(255, 0, 0)");
		toastr.error('Please fill out all required options.', 'Error');
		return null
	}

	userMetricItems = $(".item");
	tempUserMetric = null;

	//Add selected metrics
	for(var i = 0; i < userMetricItems.length; i++) {
		tempUserMetric = $(userMetricItems[i]);
		if (tempUserMetric.attr('data-sel') == "true") {
			selectedMetrics.push(tempUserMetric.attr('data-metric'));
		}
	}
	

	beforePickedDate = eval(beforeDate.pickadate('picker').get('select', 'yyyymmdd'));
	afterPickedDate = eval(afterDate.pickadate('picker').get('select', 'yyyymmdd'));


	error = false;
	if (afterPickedDate == undefined) {
		
		//Check if error condition has been met
		error = true;

		//Set color of item border
		afterDate.css("border", "3px solid rgb(255, 0, 0)");
	} 
	if (beforePickedDate == undefined) {
		
		//Check if error condition has been met
		error = true;

		//Set color of item border
		beforeDate.css("border", "3px solid rgb(255, 0, 0)");	
	}
	if (selectedMetrics.length == 0) {
		
		//Check if error condition has been met
		error = true;

		//Set color of item border
		$(".item").css("border", "3px solid rgb(255, 0, 0)");
	}

	if (error == true) {
		//send error
		toastr.error('Please fill out all required options.', 'Error');
		return null
	} else {
		//send success
		toastr.success("Generating graph.", "Success")
		return [beforePickedDate, afterPickedDate, selectedMetrics]
	}
	
}

function getGraphData(selectionInformation) {

	beforePickedDate = selectionInformation[0];
	afterPickedDate = selectionInformation[1];
	selectedMetrics = selectionInformation[2];

	requestedDates = [beforePickedDate];
	graphUserData = {};
	chartData = { labels: [], datasets: []};


	//Add dates to labels
	for (var i = 1; i < (afterPickedDate - beforePickedDate + 1); i++) {
		requestedDates.push(beforePickedDate + i);
		chartData.labels.push((beforePickedDate + i).toString());
	}


	//Add actual data to object
	for (var i = 0; i < selectedMetrics.length; i++) {

		finalGraphValue = 0;
		graphUserData[selectedMetrics[i]] = [];

		for (var j = 0; j < requestedDates.length; j++) {

			dataRequestTempURL = returnedDataTemplate[0] + selectedMetrics[i] + returnedDataTemplate[1] + requestedDates[j];
			userMetricData = getJSON(dataRequestTempURL);
			if (userMetricData['value'] != "null") {

				//Process data as necessary				
				switch (requestedUser['metrics'][selectedMetrics[i]]['format'][0]) {
					case 'percentage' :
						finalGraphValue = userMetricData['value'];
						break;
					case 'graph':
						for (var k = 0; k < userMetricData['value'].length; k++) {
							finalGraphValue += eval(userMetricData['value'][k]);
						}
						finalGraphValue /= userMetricData['value'].length;

				}
			} else {

				finalGraphValue = 0;
			}

			//Add data to object
			graphUserData[selectedMetrics[i]].push(finalGraphValue);

		}
	}

	return graphUserData

}


function drawGraph (graphUserData) {

	requestedDates = [];
	selectedMetrics = [];
	currentlyUsedColors = [];
	currentlySelectedColors = {};
	colorIndex = 0; 

	//Add data to chart and randomly pick a color
	$.each(graphUserData, function(tempUserMetric) {

		var colors = ['rgba(31, 162, 222, 0.5)', 
						'rgba(224, 67, 67, 0.5)', 
						'rgba(171, 75, 219, 0.5)', 
						'rgba(75, 219, 113, 0.5)',
						'rgba(255, 174, 82, 0.5)'];
		color = colors[colorIndex];

		if (currentlyUsedColors.indexOf(color) != -1) {
			while(currentlyUsedColors.indexOf(color) != -1) {
				colorIndex++;
				color = colors[colorIndex];
			}
		} 

		currentlyUsedColors.push(color);
		currentlySelectedColors[tempUserMetric] = color;
		chartData.datasets.push(
			{
				fillColor: color,
				label: "My First dataset",
				pointColor: color,
				pointHighlightFill: "#fff",
				pointHighlightStroke: color,
				pointStrokeColor: "#fff",
				strokeColor: "rgba(220,220,220,1)",
				data : graphUserData[tempUserMetric]
			}
		);
	});

	//Add legend info 
	$(".graph-legend-container").append('<div class="graph-legend"> <table class="graph-table"> </table> </div>');
	$(".graph-table").html('<table class="graph-table"> </table>');

	$.each(currentlySelectedColors, function(legendKeyMetric) {

		switch (requestedUserMetrics[legendKeyMetric]['format'][0]) {
			case 'percentage' : 
				legendUnit = requestedUserMetrics[legendKeyMetric]['format'][2];
				break;
			case 'graph' :
				legendUnit = requestedUserMetrics[legendKeyMetric]['format'][1];
				break;
		}

		//Add item to legen
		currentLegendColor = currentlySelectedColors[legendKeyMetric].split("(")[1].slice(0, -6);
		legendItem = legendTemplate[0] + "rgb(" + currentLegendColor +
			")" + legendTemplate[1] + legendKeyMetric + 
			" (" + legendUnit + legendTemplate[2];

		$(".graph-table").append(legendItem);
	})

	//Render chart
	respChart($(".metchart"), chartData);
}


function getQuery() {
	//Run all components
	selectionInformation = getSelection();
	if (selectionInformation != null) {
		graphUserData = getGraphData(selectionInformation);
		drawGraph(graphUserData);
	}
}

var metricMenuTemplate = ['<div class="item" data-sel="false" data-metric="', '">', '</div>']

var requestedUserName = localStorage.getItem('username');
var requestedUser = getUser(requestedUserName);
var requestedUserMetrics = requestedUser['metrics']

var tempMetricObject = {};
var tempUserMetric = null;
var currentDateObject = new Date();
var firstSelection = true;
var currentlySelectedColors = {};

var legendTemplate = ['<tr><td><div class="legend-color" style="background-color: ',
			 '"></div></td><td><div class="legend-text">',
			 ')</div></td></tr>'];
var legendItem = "";

var userMetricItems = $(".item");

var chartData = { labels: [], datasets: []};
var selectedMetrics = [];
var currentlyUsedColors = [];

var error = false;
var beforePickedDate = null;
var afterPickedDate = null;

var returnedDataTemplate = [ "http://vps.ritwikd.com:8081/" + requestedUserName + "?type=data&metric=", "&date=" ];
var requestedDates = [];
var graphUserData = {};
var dataRequestTempURL = "";

var finalGraphValue = 0;

var legendUnit = "";
var currentLegendColor = "";

var selectionInformation = [];

var colorIndex = 0;

var notAllowed = ['picture', 'raw'];

//Get list of options
$(".menbot").append('<br><p class="inst">Choose items to compare:</p class="inst"><br>');
$.each(requestedUserMetrics, function(requestedUserMetric) {
	tempMetricObject = requestedUserMetrics[requestedUserMetric];
	if (notAllowed.indexOf(tempMetricObject['format'][0])== -1) {
		$(".menbot").append(metricMenuTemplate[0] + requestedUserMetric + metricMenuTemplate[1] + requestedUserMetric + metricMenuTemplate[2]);
	}
});


//Add datepickers 
$(".menbot").append('<br><p class="inst">Choose a starting date:</p class="inst"><br>');
$(".menbot").append('<input id="beforeDate" class="pickbox pickadate">');
var afterDate = $("#afterDate");
var beforeDate = $("#beforeDate").pickadate(  {
	max : currentDateObject,
	onSet : function() {
		if (firstSelection) {
			//Create second datepicker on selection
			$(".menbot").append('<br><p class="inst">Choose an ending date:</p class="inst"><br>');
			$(".menbot").append('<input id="afterDate" class="pickbox pickadate">');
			afterDate = $("#afterDate").pickadate({
				min : this.get('select'),
				max : currentDateObject
			});
			firstSelection = false;
		} else {
			afterDate.pickadate('picker').set('min', this.get('select'), { muted : true});
		}

	}
});


//Cool colors
$(".item").on('click', function() {
	var item = $(this);
	if (item.attr("data-sel") == "false") {
		item.attr("data-sel", "true");
		$(item).css("border", "3px solid rgb(72, 154, 247)");
	} else {
		item.attr("data-sel", "false");
		$(item).css("border", "3px solid #CCC");
	}
});