# Overview

Each user in the database has a set of metrics. The metrics are stored in JSON format and, here is an example user object:

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

To add a metric, you have to add it as a key and value in the "metrics" object in the user object. 

The metric can have two possible "sources" on the backend, which define how the data is collected. Either the metric can have a "custom" data source, where everything has to be custom-implemented, or the metric can have a "file" data source, where everything is automatically pulled from a path. The path for a metric is currently defined as "*/mongo/data/db/user/<username\>/<metric\>*".

The metric can have four possible "formats" on the frontend, which defines how the data is displayed. They are as follows:

 - Percentage, where the metric is displayed as a progress bar towards a target
 - Picture, where the metric is displayed as a series of photos
 - Graph, where the metric is displayed as a graph
 - Raw, where the data is displayed as pure raw numbers or text


To add new "file" metrics, simply create a new entry in the user entry with the selected options for display format and path. The directories for the user and metrics will be automatically created, and the only thing left to do is populate the folder with data. 

To add new "custom" metrics, specify the "source" as custom. 

It is also possible to create custom frontend 
