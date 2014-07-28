var loggedInUserName = localStorage.getItem('username');
var loggedInUser = getUser(loggedInUserName);
var loggedInUserMetrics = loggedInUser.metrics;

var metricsTableMarkup = '<table class="metrics table"> <tr class="metrics section title container"> <td> <div class="metrics section title">Metrics</div> </td> </tr> </table>';

var percents = [];

//Function to set the current date for the dashboard and load the relevant data

function setDashboardDate(selectedDate) {

	Pace.restart();


	//Reset content
	$(".metrics.table").html(metricsTableMarkup);
	percents = [];
	overviewPercent(0);

	//Get user data
	var loggedInUserData = getUserData(loggedInUserName, loggedInUserMetrics, selectedDate);

	//Iterate through data
	$.each(loggedInUserMetrics, function(requestedMetric) {
		var tempDescription = "";
		var requestedMetricFormat = loggedInUserMetrics[requestedMetric]['format'];

		//Check if data is available
		if (loggedInUserData[requestedMetric] == 'null')  {
			//Display error fallback
			addRawMetric(requestedMetric, "Data not available.", "");
		} else {

			//Determine data display type
			switch (requestedMetricFormat[0]) {

				//Show percentage
				case "percentage":
					tempDescription = loggedInUserData[requestedMetric].toString() + 
						' out of ' + requestedMetricFormat[1] + ' ' + 
						requestedMetricFormat[2] + '.';

					requestedMetricPercent = 100 * loggedInUserData[requestedMetric] /
						requestedMetricFormat[1];

					//Add to array to determine final percentage
					percents.push(requestedMetricPercent);

					addPercentMetric(requestedMetric, 
						tempDescription, 
						requestedMetricPercent);
					break;

				//Show pictures
				case  "picture":
					addPhotoMetric(requestedMetric, "", loggedInUserData[requestedMetric]);
					break;

				//Show raw data
				case "raw":
					addRawMetric(requestedMetric, "", loggedInUserData[requestedMetric]);
					break;
			}
		}

		//Set overview percentage
		overviewPercent(arrayAverage(percents));

	});
}

//Getting current date for first initialization
var currentDateObject = new Date();
var currentDateString = currentDateObject.codeDate();


//Fill last 10 dates in accordance with current date
fillDates(currentDateObject);

//Set date click callback behavior
$(".date.element").on('click', function() {
    $(".date.element").attr("class", "date element");
    $(this).attr("class", "date element selected");
    setDashboardDate($(this).attr("data-date"));
});

//Set first date as selected date
$('*[data-date="' + currentDateString + '"]').attr("class", "date element selected");
setDashboardDate(currentDateString);