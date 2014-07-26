var print = function(inp) {}

Date.prototype.codeDate = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0])
};

Date.prototype.readDate = function() {
    var m_names = new Array("January", "February", "March",
        "April", "May", "June", "July", "August", "September",
        "October", "November", "December");
    var curr_date = this.getDate();
    var curr_month = this.getMonth();
    var curr_year = this.getFullYear();
    return m_names[curr_month] + " " + curr_date + ", " + curr_year
}

var getJSON = function(requestURL) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", requestURL, false);
    xmlHttp.send(null);
    return $.parseJSON(xmlHttp.responseText);
};

var getUser = function(usern) {
    var user = getJSON("http://vps.ritwikd.com:8081/" + usern + "?type=user");
    return user;
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

function overviewPercent(percent) {
    $(".overview.progress.fill").css("width", percent.toString() + "%");
}

function fillDates() {
    var date = new Date();
    var dateNum = 10;
    var dateTemplate = ['<li class="date item" data-date="', '">', '</li>'];
    var dates = [];
    var tempDateString = "";
    var tempDate = 0;

    for (var i = 0; i < dateNum; i++) {
        tempDate = new Date();
        tempDate.setDate(date.getDate() - i);
        tempDateString = dateTemplate[0] +
            tempDate.codeDate() + dateTemplate[1] +
            tempDate.readDate() + dateTemplate[2];
        dates.push(tempDateString);
        $(".date.container").append(dates[i]);
    }
}