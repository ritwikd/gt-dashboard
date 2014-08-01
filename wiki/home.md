### This document describes the process of adding new metrics for users in the database. 

Each user in the database has a set of metrics. The metrics are stored in JSON format. Below is an example user object.

```JSON
{  
   "name":"Ritwik Dutta",
   "username":"ritwikdutta1406421674",
   "metrics":{  
      "sleep":{  
         "source":"file",
         "format":[  
            "percentage",
            8,
            "hours"
         ],
         "path":[  
            "mongo/data/db/",
            "sleep"
         ]
      },
      "weather":{  
         "source":"custom",
         "format":[  
            "graph",
            "° C"
         ],
         "type":"weather",
         "location":"ksfo"
      },
      "pictures":{  
         "source":"file",
         "format":[  
            "picture"
         ],
         "path":[  
            "mongo/data/db/",
            "pictures"
         ]
      },
      "motion":{  
         "source":"custom",
         "format":[  
            "percentage",
            400,
            "steps"
         ],
         "type":"jawbone",
         "auth":"b6_3pfGGwEjReOXSnWIyQO0-Al13wvvmyZNaiuNHtPrR6_kAcLtg_W1PaWiav9FR8EvaJSumcI0GoYT-V9UbpVECdgRlo_GULMgGZS0EumxrKbZFiOmnmAPChBPDZ5JP"
      }
   }
}
```

# Adding new metrics

## Backend implementation

To add a metric, you have to add it as a key and a value in the **```metrics```** object in the user object. 

The metric can have two possible **```sources```** on the backend, which define how the data is collected. The metric can either have a **```custom```** data source, where everything has to be custom-implemented, or a **```file```** data source, where everything is automatically pulled from a directory. The path to the directory for a metric is currently defined as **```/mongo/data/db/user/<username\>/<metric\>```**.

The metric can have four possible **```formats```** on the frontend, which defines how the data is displayed. They are as follows:

 - Percentage: where the metric is displayed as a progress bar towards a target
 - Picture: where the metric is displayed as a series of photos
 - Graph: where the metric is displayed as a graph
 - Raw: where the data is displayed as pure raw numbers or text

### File metric

To add a new **```file```** metric, create a *new metric* entry in the user object with the selected options for display format and path. The directories for the user and associated metrics will be automatically created, after which the folders should be populated with data. 

### Custom metric


To add a new **```custom```** metric, create a new metric entry in the user object with the **```source```** set to custom and the selected options for display format as well as any other fields deemed necessary (*e.g.*, a location for weather, or an API key for the Jawbone UP). 

Implement a custom Python class to pull and process the data. Insert the class into the file **```gt-dashboard/server/sensors/custom.py```**.  The **```custom```** class for the Jawbone UP is shown below.

```Python
class jawboneLib:
    def __init__(self, userAuthorizationToken):
        self.userAuthorizationToken = userAuthorizationToken

    def getMetricData(self):
        apiAuthorizationHeaders = {'Authorization' : 'Bearer ' +  self.userAuthorizationToken.encode('ascii', 'ignore') }        
        userJawboneData = requests.get('https://jawbone.com/nudge/api/v.1.1/users/@me/moves', headers = apiAuthorizationHeaders)
        userJawboneDay = json.loads(userJawboneData.text)['data']['items'][0]
        userJawboneDaySteps = 0
		currentDate = getFormattedTime("%Y%m%d")

        if (str(userJawboneDay['date']) == currentDate):
            userJawboneDay = userJawboneDay['details']['hourly_totals']
            for userJawboneHour in userJawboneDay.keys():
                userJawboneDaySteps += userJawboneDay[userJawboneHour]['steps'] 

        return userJawboneDaySteps
```


Edit **```gt-dashboard/server/sensor_data.py```** and insert the custom call to the class into the if/elif statements. The current set of statements is shown below.

```Python
elif userMetricsList[metric]['source'] == 'custom':
		customData = ""
		
		if userMetricsList[metric]['type'] == 'jawbone':
			customDataObject = custom.jawboneLib(userMetricsList[metric]['auth'])
			customData = customDataObject.getMetricData()
		elif userMetricsList[metric]['type'] == 'weather':
			customDataObject = custom.weatherLib(userMetricsList[metric]['location'])
			customData = customDataObject.getMetricData()
```

The only thing that the custom metric class needs to return is the raw data. It will be automatically tagged by date, username, and metric so that it can later be found in the database.

## Frontend implementation


It is also possible to create custom display formats on the frontend. However, this process is far more difficult, and requires knowledge of **```HTML, CSS, and JavaScript```** for the frontend in addition to **```Python```** for the backend. Unless you are proficient in all three, it is highly recommmend that you open an issue (with proper tags) requesting your frontend format. 

Write a function that generates the markup for your format, appends it to the table of metrics, and sets it to the correct value. This should be consistent with the current theme. The functions for displaying metrics go in **```gt-dashboard/web/js/metrics.js```**. The code for displaying a percentage is shown below.

```JavaScript
function addPercentMetric(metricName, metricDescription, metricPercent) {

    function genPercentMarkup(metricName, metricDescription) {
        var metricMarkupTemplate = ['<tr class="metrics element container" data-metric="',
            '"><td class="metrics element info"> <div class="metrics element title">',
            '</div> <div class="metrics element description">',
            '</div></td><td class="metrics element progress"><div class="metrics element base"><div class="metrics element fill ',
            '  "></div></div></td><td class="metrics element number ',
            '"><div class="metrics element percent ',
            '"></div></td></tr>'
        ];
        var metString = metricMarkupTemplate[0] +
            metricName + metricMarkupTemplate[1] +
            metricName + metricMarkupTemplate[2] +
            metricDescription + metricMarkupTemplate[3] +
            metricName + metricMarkupTemplate[4] +
            metricName + metricMarkupTemplate[5] +
            metricName + metricMarkupTemplate[6];
        return metString;
    };

    function setPercent(metricName, metricPercent) {
        $(".metrics.element.percent." + metricName).text(metricPercent.toString() + "%");
        metricPercent = (metricPercent > 100) ? 100 : metricPercent;
        $(".metrics.element.fill." + metricName).animate({
            "width": metricPercent.toString() + "%"
        }, 250);
    }

    var generatedMetric = genPercentMarkup(metricName, metricDescription);
    $(".metrics.table").append(generatedMetric);
    setPercent(metricName, metricPercent);
}
```
Edit the **```switch```** statement in **```gt-dashboard/web/js/dash.js```** to add in your custom display format. The statement is shown below.

```JavaScript
switch (requestedMetricFormat[0]) {

	//Show percentage
	case "percentage":
		tempDescription = loggedInUserData[requestedMetric].toString() + 
			' out of ' + requestedMetricFormat[1] + ' ' + 
			requestedMetricFormat[2] + '.';

		requestedMetricPercent = Math.round(100 * loggedInUserData[requestedMetric] /
			requestedMetricFormat[1]);

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

	case "graph":
		addGraphMetric(requestedMetric, 
			(requestedMetric == "weather") ? "Hourly Temperatures (&deg;C)." : "",
			loggedInUserData[requestedMetric]);
		break;
}
```

Make sure that the new metric works, and then the process is finished.