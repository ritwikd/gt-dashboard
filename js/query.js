var getJSON = function (requestURL) {
			    var xmlHttp = new XMLHttpRequest();
			    xmlHttp.open("GET", requestURL, false);
			    xmlHttp.send(null);
			    return $.parseJSON(xmlHttp.responseText);
			};

			var getMets = function (usern) {
				var user = getJSON("http://vps.ritwikd.com:8081/" + usern + "?type=user");
			    return Object.keys(user.metrics);
			}

			var getStats = function (usern) {
			    var user = getJSON("http://vps.ritwikd.com:8081/" + usern + "?type=user");
			    return Object.keys(user.stats);
			}

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
			        onAnimationComplete: null
			    }

			    var ctx = selector.get(0).getContext("2d");

			    var container = $(selector).parent();


			    $(window).resize(generateChart);

				function generateChart() {

			        var ww = selector.attr('width', $(container).width());
			        new Chart(ctx).Line(data, option);
			    };

			    generateChart();
			}

		    function capFrstLet(string)
			{
			    return string.charAt(0).toUpperCase() + string.slice(1);
			};

			function selectItem (item) {
				var item = $(item);
				if (item.attr("data-sel") == "false") {
					item.attr("data-sel", "true");
					$(item).css("background-color", "rgb(235, 235, 235)");
					$(item).css("color", "rgb(72, 154, 247)");
				} else {
					$(item).css("background-color", "rgb(245, 245, 245)");
					item.attr("data-sel", "false");
					$(item).css("color", "rgb(0, 0, 0)");
				}
				
			};

			function getSel () {
				var items = $(".item");
				var item = null;
				for(var i = 0; i < items.length; i++) {
					item = $(items[i]);
					if (item.attr('data-sel') == "true") {
						console.log(item.attr('data-metric'));
					}
				}
			}

			function function_name (argument) {
				// body...
			}


			var menu = ['<div class="item" data-sel="false" data-metric="', '" onclick="javscript: selectItem(this);">', '</div>']
			var date = new Date();
			var username = location.hash.substring(1);
			var mets = getMets(username);
			var stats = getStats(username);
			var elem = '';
			for(var i = 0; i < mets.length; i++) {
				elem = menu[0] + mets[i] + menu[1] + capFrstLet(mets[i]) + menu[2];
				$(".menu").append(elem);
			}