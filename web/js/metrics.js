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

function addGraphMetric(metricName, metricDescription, metricArray) {
    function genGraphMarkup(metricName, metricDescription) {
        var metricMarkupTemplate = ['<tr class="metrics element container" data-metric="',
            '"><td class="metrics element info"><div class="metrics element title">',
            '</div> <div class="metrics element description">',
            '</div></td><td class="metrics element graph"><canvas class="metrics element ctx ',
            '"></canvas></td></tr>'];

        var metString = metricMarkupTemplate[0] + metricName +
            metricMarkupTemplate[1] + metricName + metricMarkupTemplate[2] +
            metricDescription + metricMarkupTemplate[3] +
            metricName + metricMarkupTemplate[4];
        return metString;
    }

    function setGraph(metricName, metricArray) {

        var chartData = { labels : [], datasets : []};
        metricArrayNum = [];

        for (var i = 0; i < metricArray.length; i++) {
            metricArrayNum = parseFloat(metricArray[i]);
            chartData['labels'].push("");
        }

        graphData =  {
                        fillColor: 'rgba(31, 162, 222, 0.2)',
                        label: "My First dataset",
                        pointColor: 'rgba(31, 162, 222, 0.2)',
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: 'rgba(31, 162, 222, 0.2)',
                        pointStrokeColor: "#fff",
                        strokeColor: "rgba(220,220,220,1)",
                        data : metricArray
                    }
        chartData['datasets'].push(graphData);
        console.log(chartData);
        respChart($(".ctx." + metricName), chartData);
    }

    var generatedMetric = genGraphMarkup(metricName, metricDescription);
    $(".metrics.table").append(generatedMetric);
    setGraph(metricName, metricArray);
}

function addPhotoMetric(metricName, metricDescription, metricPhotos) {

    function genPhotoMarkup(metricName, metricDescription) {
        var metricMarkupTemplate = ['<tr class="metrics element container" data-metric="',
            '"><td class="metrics element info"><div class="metrics element title">',
            '</div> <div class="metrics element description">',
            '</div></td><td class="metrics element photos"><div class="metrics element pics ',
            '"></div></td></tr>'
        ];
        var metString = metricMarkupTemplate[0] + metricName +
            metricMarkupTemplate[1] + metricName + metricMarkupTemplate[2] +
            metricDescription + metricMarkupTemplate[3] +
            metricName + metricMarkupTemplate[4];
        return metString;
    }

    function setImages(metricName, metricPhotos) {
        var imageMarkupTemplate = ['<a class="element fancybox" rel="group" href="data:image/png;base64,',
            '"><img class = "metrics element image" src="data:image/png;base64,',
            '" alt="image" /></a>'
        ];
        var temporaryImageString = "";
        for (var i = 0; i < metricPhotos.length; i++) {
            temporaryImageString = imageMarkupTemplate[0] +
                metricPhotos[i] + imageMarkupTemplate[1] +
                metricPhotos[i] + imageMarkupTemplate[2];
            $(".metrics.element.pics." + metricName).append(temporaryImageString);
        }

        $(".metrics.element.pics." + metricName).animate({
            "opacity": "1"
        }, 250);

        $(".fancybox").fancybox();

    }

    var generatedMetric = genPhotoMarkup(metricName, metricDescription);
    $(".metrics.table").append(generatedMetric);
    setImages(metricName, metricPhotos);
}

function addRawMetric(metricName, metricDescription, metricData) {

    function genRawMarkup(metricName, metricDescription, metricData) {
        var metricMarkupTemplate = ['<tr class="metrics element container" data-metric="',
            '"><td class="metrics element info"> <div class="metrics element title">',
            '</div> <div class="metrics element description">',
            '</div></td><td class="metrics element text"><div class="metrics element raw ',
            '">',
            '</div></td></tr>'
        ];

        var metString = metricMarkupTemplate[0] + metricName +
            metricMarkupTemplate[1] + metricName + metricMarkupTemplate[2] +
            metricDescription + metricMarkupTemplate[3] +
            metricName + metricMarkupTemplate[4] + metricData + metricMarkupTemplate[5];
        return metString;
    }

    var generatedMetric = genRawMarkup(metricName, metricDescription, metricData);
    $(".metrics.table").append(generatedMetric);
}