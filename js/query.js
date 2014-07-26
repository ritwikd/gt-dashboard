toastr.options.closeButton = true;
toastr.options.showMethod = 'slideDown'; 
toastr.options.hideMethod = 'slideUp'; 
toastr.options.positionClass = 'toast-bottom-left'

var getJSON = function (requestURL) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", requestURL, false);
    xmlHttp.send(null);
    return $.parseJSON(xmlHttp.responseText);
};

var getMets = function (usern) {
	var user = getJSON("http://vps.ritwikd.com:8081/" + usern + "?type=user");
    return Object.keys(user.metrics);
};

var getStats = function (usern) {
    var user = getJSON("http://vps.ritwikd.com:8081/" + usern + "?type=user");
    return Object.keys(user.stats);
};

var getName = function (usern) {
	var user = getJSON("http://vps.ritwikd.com:8081/" + usern + "?type=user");
    return user.fullname;
};

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

function capFrstLet(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
};

var chosencolors = {};
var usedcolors = [];

function getSel () {
	var items = $(".item");
	var item = null;
	var chartData = { labels: [], datasets: []};
	var metrics = [];
	for(var i = 0; i < items.length; i++) {
		item = $(items[i]);
		if (item.attr('data-sel') == "true") {
			metrics.push(item.attr('data-metric'));
		}
	}
	if (first) {
		error = true;
		beforeDate.css("border", "3px solid rgb(255, 0, 0)");
		toastr.error('Please fill out all required options.', 'Error');
	} else {
		var bef = eval(beforeDate.pickadate('picker').get('select', 'yyyymmdd'));
		var aft = eval(afterDate.pickadate('picker').get('select', 'yyyymmdd'));
		var ret = [ "http://vps.ritwikd.com:8081/" + sessionStorage.getItem('username') + "?type=data&metric=", "&date=" ];
		var error = false;
		if (aft == undefined) {
			error = true;
			afterDate.css("border", "3px solid rgb(255, 0, 0)");
		} 
		if (bef == undefined) {
			error = true;
			beforeDate.css("border", "3px solid rgb(255, 0, 0)");	
		}
		if (metrics.length == 0) {
			error = true;
			$(".item").css("border", "3px solid rgb(255, 0, 0)");
		}
		if (error == true) {
			toastr.error('Please fill out all required options.', 'Error');
		} else {
			toastr.success("Generating graph.", "Success")
			var dates = [];
			dates.push(bef);
			var data = {};
			var tempurl = "";
			for (var i = 1; i < (aft - bef + 1); i++) {
				dates.push(bef + i);
				chartData.labels.push((bef + i).toString());
			}
			for (var i = 0; i < metrics.length; i++) {
				data[metrics[i]] = [];
				for (var j = 0; j < dates.length; j++) {
					tempurl = ret[0] + metrics[i] + ret[1] + dates[j];
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
					
					data[metrics[i]].push(metData.value);
				}
			}
			usedcolors = [];
			$.each(data, function(item) {
				
				var colors = ['rgba(72, 154, 247, 0.2)', 'rgba(215, 107, 44, 0.2)', 'rgba(215, 45, 204, 0.2)', ' rgba(101, 255, 105, 0.2)'];
				color = colors[Math.floor(Math.random()*colors.length)];
				if (usedcolors.indexOf(color) != -1) {
					while(usedcolors.indexOf(color) != -1) {
						color = colors[Math.floor(Math.random()*colors.length)];
					}
				} 
				usedcolors.push(color);
				chosencolors[item] = color;
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
						data : data[item]
					}
				);
			});
			console.log(chartData);
			var template = ['<tr><td><div class="legend-color" style="background-color: ',
			 '"></div></td><td><div class="legend-text">',
			 '</div></td></tr>'];
			$(".graph-legend-container").append('<div class="graph-legend"> <table class="graph-table"> </table> </div>');
			var legendItem = "";
			$(".graph-table").html('<table class="graph-table"> </table>');
			$.each(chosencolors, function(met) {
				legendItem = template[0] + "rgb(" + chosencolors[met].split("(")[1].slice(0, -6)  + ")" + template[1] + met + template[2];
				$(".graph-table").append(legendItem);
			})
			

			respChart($(".metchart"), chartData);
		}
	
	}
}

var menu = ['<div class="item" data-sel="false" data-metric="', '">', '</div>']
var date = new Date();
var username = sessionStorage.getItem('username');
var mets = getMets(username);
var stats = getStats(username);
var name = getName(username);
var elem = '';
$(".name").text(name);
$(".menbot").append('<br><p class="inst">Choose items to compare:</p class="inst"><br>');
for(var i = 0; i < mets.length; i++) {
	elem = menu[0] + mets[i] + menu[1] + capFrstLet(mets[i]) + menu[2];
	$(".menbot").append(elem);
}
for(var i = 0; i < stats.length; i++) {
	if (stats[i] != 'photos') {
		elem = menu[0] + stats[i] + menu[1] + capFrstLet(stats[i]) + menu[2];
		$(".menbot").append(elem);
	}
}

var date = new Date();
var first = true;

$(".menbot").append('<br><p class="inst">Choose a starting date:</p class="inst"><br>');
$(".menbot").append('<input id="beforeDate" class="pickbox pickadate">');
var afterDate = $("#afterDate");

var beforeDate = $("#beforeDate").pickadate(  {
	max : date,
	onSet : function() {
		if (first) {
			$(".menbot").append('<br><p class="inst">Choose an ending date:</p class="inst"><br>');
			$(".menbot").append('<input id="afterDate" class="pickbox pickadate">');
			afterDate = $("#afterDate").pickadate({
				min : this.get('select'),
				max : date
			});
			first = false;
		} else {
			afterDate.pickadate('picker').set('min', this.get('select'), { muted : true});
		}

	}
});

			// $(".menbot").append('<br><p class="inst">Choose time range:</p class="inst"><br>');
			// $(".menbot").append('<input id="beforeTime" class="pickbox time">');
			// $(".menbot").append('<input id="afterTime" class="pickbox time">');
			// var beforeTime = $("#beforeTime").pickatime();
			// var afterTime = $("#afterTime").pickatime();
			// beforeTime.pickatime('picker').on('set', function(event) {
			// 	if (event.select) {
			// 		beforeTime.css("border", "3px solid rgb(72, 154, 247)");
			// 		afterTime.pickatime('picker').set('min', this.get('select'));
			// 	} else if ('clear' in event) {
			// 		before.css("border", "3px solid #CCC");
			// 		afterTime.pickatime('picker').set('min', false);
			// 	}
			// });
			// afterTime.pickatime('picker').on('set', function(event) {
			// 	if (event.select) {
			// 		afterTime.css("border", "3px solid rgb(72, 154, 247)");
			// 		beforeTime.pickatime('picker').set('max', this.get('select'));
			// 	} else if ('clear' in event) {
			// 		afterTime.css("border", "3px solid #CCC");
			// 		beforeTime.pickatime('picker').set('max', false);
			// 	}
			// });

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

