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

			var menu = ['<div class="item" data-sel="false" data-metric="', '" onclick="javscript: selectItem(this);">', '</div>']
			var date = new Date();
			var username = sessionStorage.getItem('username');
			var mets = getMets(username);
			var stats = getStats(username);
			var name = getName(username);
			var elem = '';
			$(".name").text(name);
			$(".mentop").append('<br><p class="inst">Choose items to compare:</p class="inst"><br>');
			for(var i = 0; i < mets.length; i++) {
				elem = menu[0] + mets[i] + menu[1] + capFrstLet(mets[i]) + menu[2];
				$(".mentop").append(elem);
			}
			for(var i = 0; i < stats.length; i++) {
				if (stats[i] != 'photos') {
					elem = menu[0] + stats[i] + menu[1] + capFrstLet(stats[i]) + menu[2];
					$(".mentop").append(elem);
				}
			}
			$(".mentop").append('<br><p class="inst">Choose date range:</p class="inst"><br>');
			$(".mentop").append('<input id="beforeDate" class="pickbox pickadate">');
			$(".mentop").append('<input id="afterDate" class="pickbox pickadate">');
			var beforeDate = $("#beforeDate").pickadate();
			var afterDate = $("#afterDate").pickadate();
			beforeDate.pickadate('picker').on('set', function(event) {
				if (event.select) {
					afterDate.pickadate('picker').set('min', this.get('select'));
				} else if ('clear' in event) {
					afterDate.pickadate('picker').set('min', false);
				}
			});
			afterDate.pickadate('picker').on('set', function(event) {
				if (event.select) {
					beforeDate.pickadate('picker').set('max', this.get('select'));
				} else if ('clear' in event) {
					beforeDate.pickadate('picker').set('max', false);
				}
			});
			$(".mentop").append('<br><p class="inst">Choose time range:</p class="inst"><br>');
			$(".mentop").append('<input id="beforeTime" class="pickbox time">');
			$(".mentop").append('<input id="afterTime" class="pickbox time">');
			var beforeTime = $("#beforeTime").pickatime();
			var afterTime = $("#afterTime").pickatime();
			beforeTime.pickatime('picker').on('set', function(event) {
				if (event.select) {
					afterTime.pickatime('picker').set('min', this.get('select'));
				} else if ('clear' in event) {
					afterTime.pickatime('picker').set('min', false);
				}
			});
			afterTime.pickatime('picker').on('set', function(event) {
				if (event.select) {
					beforeTime.pickatime('picker').set('max', this.get('select'));
				} else if ('clear' in event) {
					beforeTime.pickatime('picker').set('max', false);
				}
			});