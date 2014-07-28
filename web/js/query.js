toastr.options.closeButton = true;
toastr.options.showMethod = 'slideDown'; 
toastr.options.hideMethod = 'slideUp'; 
toastr.options.positionClass = 'toast-bottom-left'

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

function getSel () {

	userMetricItems = $(".item");
	tempUserMetric = null;
	chartData = { labels: [], datasets: []};
	selectedMetrics = [];
	currentlyUsedColors = [];


	for(var i = 0; i < userMetricItems.length; i++) {
		tempUserMetric = $(userMetricItems[i]);
		if (tempUserMetric.attr('data-sel') == "true") {
			selectedMetrics.push(tempUserMetric.attr('data-metric'));
		}
	}

	if (firstSelection) {

		error = true;
		beforeDate.css("border", "3px solid rgb(255, 0, 0)");
		toastr.error('Please fill out all required options.', 'Error');
	} else {

		beforePickedDate = eval(beforeDate.pickadate('picker').get('select', 'yyyymmdd'));
		afterPickedDate = eval(afterDate.pickadate('picker').get('select', 'yyyymmdd'));


		error = false;
		if (afterPickedDate == undefined) {
			error = true;
			afterDate.css("border", "3px solid rgb(255, 0, 0)");
		} 
		if (beforePickedDate == undefined) {
			error = true;
			beforeDate.css("border", "3px solid rgb(255, 0, 0)");	
		}
		if (selectedMetrics.length == 0) {
			error = true;
			$(".item").css("border", "3px solid rgb(255, 0, 0)");
		}
		if (error == true) {
			toastr.error('Please fill out all required options.', 'Error');
		} else {
			toastr.success("Generating graph.", "Success")
			var dates = [];
			dates.push(beforePickedDate);
			var data = {};
			var tempurl = "";
			for (var i = 1; i < (afterPickedDate - beforePickedDate + 1); i++) {
				dates.push(beforePickedDate + i);
				chartData.labels.push((beforePickedDate + i).toString());
			}
			for (var i = 0; i < selectedMetrics.length; i++) {
				data[selectedMetrics[i]] = [];
				for (var j = 0; j < dates.length; j++) {
					tempurl = returnedDataTemplate[0] + selectedMetrics[i] + returnedDataTemplate[1] + dates[j];
					metData = getJSON(tempurl);
					if (metData.value == "null") {
						metData["value"] = 0;
					} else {
						if (metData.metric == 'weather') {
							var totalTemp = 0;
							var temps = metData.temps;
							for (var k = 0; k < temps.length; k++) {
								totalTemp += eval(temps[k]);
							}
							metData["value"] = (totalTemp) / temps.length;
						}
					}
					
					data[selectedMetrics[i]].push(metData.value);
				}
			}

			$.each(data, function(tempUserMetric) {
				var colors = ['rgba(72, 154, 247, 0.2)', 'rgba(215, 107, 44, 0.2)', 'rgba(215, 45, 204, 0.2)', ' rgba(101, 255, 105, 0.2)'];
				color = colors[Math.floor(Math.random()*colors.length)];
				if (currentlyUsedColors.indexOf(color) != -1) {
					while(currentlyUsedColors.indexOf(color) != -1) {
						color = colors[Math.floor(Math.random()*colors.length)];
					}
				} 
				currentlyUsedColors.push(color);
				currentlySelectedColors[tempUserMetric] = color;
				chartData.datasets.push(
					{
						data: Array[7],
						fillColor: color,
						label: "My First dataset",
						pointColor: color,
						pointHighlightFill: "#fff",
						pointHighlightStroke: color,
						pointStrokeColor: "#fff",
						strokeColor: "rgba(220,220,220,1)",
						data : data[tempUserMetric]
					}
				);
			});

			$(".graph-legend-container").append('<div class="graph-legend"> <table class="graph-table"> </table> </div>');
			$(".graph-table").html('<table class="graph-table"> </table>');
			
			$.each(currentlySelectedColors, function(legendKeyMetric) {
				legendItem = legendTemplate[0] + "rgb(" + currentlySelectedColors[legendKeyMetric].split("(")[1].slice(0, -6) 
					+ ")" + legendTemplate[1] + legendKeyMetric + " (" + requestedUserMetrics[legendKeyMetric]['unit'] + legendTemplate[2];
				$(".graph-table").append(legendItem);
			})
			

			respChart($(".metchart"), chartData);
		}
	
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

var returnedDataTemplate = [ "http://vps.ritwikd.com:8081/" + requestedUser + "?type=data&metric=", "&date=" ];

$(".menbot").append('<br><p class="inst">Choose items to compare:</p class="inst"><br>');
$.each(requestedUserMetrics, function(requestedUserMetric) {
	tempMetricObject = requestedUserMetrics[requestedUserMetric];
	if (tempMetricObject['format'][0] != 'picture') {
		$(".menbot").append(metricMenuTemplate[0] + requestedUserMetric + metricMenuTemplate[1] + requestedUserMetric + metricMenuTemplate[2]);
		
	}
});


$(".menbot").append('<br><p class="inst">Choose a starting date:</p class="inst"><br>');
$(".menbot").append('<input id="beforeDate" class="pickbox pickadate">');
var afterDate = $("#afterDate");
var beforeDate = $("#beforeDate").pickadate(  {
	max : currentDateObject,
	onSet : function() {
		if (firstSelection) {
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