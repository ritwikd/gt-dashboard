function addPercentMetric(metricName, metricDescription, metricPercent) {
    function genPercentMarkup(metricName, metricDescription) {
        var metricMarkupTemplate = ['<tr class="metrics item container" data-metric="',
            '"><td class="metrics item info"> <div class="metrics item title">',
            '</div> <div class="metrics item description">',
            '</div></td><td class="metrics item progress"><div class="metrics item base"><div class="metrics item fill ',
            '  "></div></div></td><td class="metrics item number ',
            '"><div class="metrics item percent ',
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
        $(".metrics.item.percent." + metricName).text(metricPercent.toString() + "%");
        $(".metrics.item.fill." + metricName).animate({
            "width": metricPercent.toString() + "%"
        }, 250);
    }

    var generatedMetric = genPercentMarkup(metricName, metricDescription);
    $(".metrics.table").append(generatedMetric);
    setPercent(metricName, metricPercent);
}

function addPhotoMetric(metricName, metricDescription, metricPhotos) {

    function genPhotoMarkup(metricName, metricDescription) {
        var metricMarkupTemplate = ['<tr class="metrics item container" data-metric="',
            '"><td class="metrics item info"> <div class="metrics item title">',
            '</div> <div class="metrics item description">',
            '</div></td><td class="metrics item photos"><div class="metrics item pics ',
            '"></div></td></tr>'
        ];
        var metString = metricMarkupTemplate[0] + metricName +
            metricMarkupTemplate[1] + metricName + metricMarkupTemplate[2] +
            metricDescription + metricMarkupTemplate[3] +
            metricName + metricMarkupTemplate[4];
        return metString;
    };

    function setImages(metricName, metricPhotos) {
        var imageMarkupTemplate = ['<a class="fancybox" rel="group" href="data:image/png;base64,',
            '"><img class = "metrics item image" src="data:image/png;base64,',
            '" alt="image" /></a>'
        ];
        var temporaryImageString = "";
        for (var i = 0; i < metricPhotos.length; i++) {
            temporaryImageString = imageMarkupTemplate[0] +
                metricPhotos[i] + imageMarkupTemplate[1] +
                metricPhotos[i] + imageMarkupTemplate[2];
            $(".metrics.item.pics." + metricName).append(temporaryImageString);
        }

        $(".metrics.item.pics." + metricName).animate({
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
        var metricMarkupTemplate = ['<tr class="metrics item container" data-metric="',
            '"><td class="metrics item info"> <div class="metrics item title">',
            '</div> <div class="metrics item description">',
            '</div></td><td class="metrics item text"><div class="metrics item raw ',
            '">',
            '</div></td></tr>'
        ];
        var metString = metricMarkupTemplate[0] + metricName +
            metricMarkupTemplate[1] + metricName + metricMarkupTemplate[2] +
            metricDescription + metricMarkupTemplate[3] +
            metricName + metricMarkupTemplate[4] + metricData + metricMarkupTemplate[5];
        return metString;
    };
    var generatedMetric = genRawMarkup(metricName, metricDescription, metricData);
    $(".metrics.table").append(generatedMetric);
}