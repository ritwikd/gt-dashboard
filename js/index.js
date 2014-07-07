var print = function(inp) { console.log(inp); }

Array.prototype.avs = function(){

    if(this.length > 0) {
        for(var i = 1; i < this.length; i++)
        {
            if(this[i] !== this[0])
                return false;
        }
    }
    return true;
}

Date.prototype.gDate = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString();
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0])
  };

var metTemp = ['<div class = "metcont">' +
                '<div class = "met ',' mettitle">',
                '<p class = "met ',
                ' progdesc"></div><div class = "met ',
                ' progcont"><div class = "met ', ' progbase"></div>'
                +'<div class = "met ',
                ' progfill"></div></div><p class = "met ',
                ' proglab" >0%</p></p></div>'];

var wetTemp = '<div class="metcont" style="opacity: 1;"><div class="met stat Weather mettitle">Weather <p class="met stat Weather progdesc"> Hourly temps.(&deg;C)</p></div><div class = "met weather elem progcont"><canvas class = "met weather canvas"></canvas> </div> </div> </div>';
var wetNotTemp = '<div class="metcont" style="opacity: 1;"><div class="met stat Weather mettitle">Weather <p class="met stat Weather progdesc">Data not available.</p></div><div class = "met weather elem progcont"><canvas class = "met weather canvas"></canvas> </div> </div> </div>';
var imCT = '<div class="metcont" style="opacity: 1;"> <div class="met stat photos mettitle"> Pictures <p class="met stat photos progdesc"> Pictures.</p> </div> <div class="met photos progcont"> </div> </div>';
var imNT = '<div class="met stat photos mettitle"> Pictures <p class="met stat photos progdesc"> Data not available.</p> </div>';
var imT = ['<img class = "met photos img" src="data:image/png;base64,', '" alt="image" />'];


var totalPercents = {};

var addMetric = function(elemClass, metTitle) {
    var div = metTemp[0] + elemClass;
    div += metTemp[1] + metTitle;
    div += metTemp[2] + elemClass;
    div += metTemp[3] + elemClass;
    div += metTemp[4] + elemClass;
    div += metTemp[5] + elemClass;
    div += metTemp[6] + elemClass;
    div += metTemp[7];
    $("#metrics").append(div);
    setTimeout(
        function() {
            $(".metcont").css("opacity", "1");
        }, 100);
};

var setMainProg = function() {
    var res = 0;
    var num = 0;
    print(totalPercents);
    $.each(totalPercents, function(i) {
      res += totalPercents[i]; num++; });
    var amt = res/num;
    $(".overview.progfill").css("background-color", getCol(amt));
    $(".overview.progfill").css("box-shadow", "0px 7px 0px 0px " + getShadCol(amt));
    $(".overview.proglab").text(Math.round(amt).toString() + "%");
    if (amt > 100) {
        amt = 100;
    }
    $(".overview.progfill").css("width", (amt/100) * parseInt($(".overview.progbase").css("width")));
};

var getJSON = function(requestURL) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", requestURL, false );
    xmlHttp.send( null );
    return $.parseJSON(xmlHttp.responseText);
};

var setProg = function(elemClass, progAmt, descUp) {
    var bar = $("." + elemClass + ".progfill");
    var base = $("." + elemClass + ".progbase");
    var label = $("." + elemClass + ".proglab");
    var desc = $("." + elemClass + ".progdesc");
    if (progAmt != null) {
        bar.css("background-color", getCol(progAmt));
        bar.css("box-shadow", "0px 7px 0px 0px " + getShadCol(progAmt));
        label.text(Math.round(progAmt).toString() + "%");
        totalPercents[elemClass] = progAmt;
        if (progAmt > 100) {
            progAmt = 100;
        }
        bar.css("width", (progAmt / 100) * parseInt(base.css("width")));
    }
    desc.text(descUp);
    setMainProg();
};


var addProg = function(elemClass, progAmt, descUp) {
    addMetric(elemClass, elemClass);
    setProg(elemClass, progAmt, descUp);
};

var getCol = function(progAmt) {
    return (progAmt < 50) ? "#F75E5E" : (progAmt < 80) ? "#F59631" : "#5EE66E";
};

var getShadCol = function(progAmt) {
    return (progAmt < 50) ? "#CF3636" : (progAmt < 80) ? "#DE7C14" : "#22BF35";
};

$("#metrics").css("margin-top", parseInt($("#mainhead").css("height")) - 75);

window.onscroll = function () {
    if($("body").scrollTop() > 10) {
        $("#divider").css("opacity", "1");
    } else {
        $("#divider").css("opacity", "0");
    }
};

var getMet = function(usern, metric, date) {
    var user = getJSON("http://vps.ritwikd.com:8081/" + usern + "?type=user");
    var data = getJSON("http://vps.ritwikd.com:8081/" + usern + "?type=data&metric=" + metric + "&date=" + date);
    if (data.value == null) {
        return null;
    }
    return [data.value, parseInt(user.metrics[metric][0]), user.metrics[metric][1]];
}

var getMets = function(usern) {
    var user = getJSON("http://vps.ritwikd.com:8081/" + usern + "?type=user");
    return Object.keys(user.metrics);
}

var getStats = function(usern) {
    var user = getJSON("http://vps.ritwikd.com:8081/" + usern + "?type=user");
    return Object.keys(user.stats);
}

function respChart(selector, data){

    var option = {
        scaleOverlay : false,
        scaleOverride : false,
        scaleSteps : null,
        scaleStepWidth : null,
        scaleStartValue : null,
        scaleLineColor : "rgba(0,0,0,.1)",
        scaleLineWidth : 1,
        scaleShowLabels : true,
        scaleLabel : "<%=value%>",
        scaleFontFamily : "arial",
        scaleFontSize : 10,
        scaleFontStyle : "normal",
        scaleFontColor : "#909090",
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        bezierCurve : true,
        pointDot : true,
        pointDotRadius : 3,
        pointDotStrokeWidth : 1,
        datasetStroke : true,
        datasetStrokeWidth : 2,
        datasetFill : true,
        animation : true,
        animationSteps : 60,
        animationEasing : "easeOutQuart",
        onAnimationComplete : null
    }

    var ctx = selector.get(0).getContext("2d");

    var container = $(selector).parent();


    $(window).resize( generateChart );


    function generateChart(){

        var ww = selector.attr('width', $(container).width() );

        new Chart(ctx).Line(data, option);
    };


    generateChart();

}



var dkey;
var date = new Date();
var username = location.hash.substring(1);
location.hash = "#" + date.gDate();
var curMet;
var mets = getMets(username);
var stats = getStats(username);
var isvalid = false;

for (var i = 0; i < 10; i++) {
    dkey = date.toString().substring(4,10) + ',' + date.toString().substring(10,15);
    $("#datebar").append('<li id="' + date.gDate() + '"><a href="#' + date.gDate() + '">' + dkey + '</a></li>');
    date.setDate(date.getDate() - 1);
}

$("#datebar a").css("color", "#444444");



$(window).on('hashchange', function() {
    isvalid = false;
    $("#datebar a").css("color", "#444444");
    $("#datebar a").css("font-weight", "300");
    $("#datebar a").css("font-size", "100%");
    $(location.hash + " a").css("color", "#4093E6");
    $(location.hash + " a").css("font-weight", "500");
    $(location.hash + " a").css("font-size", "125%");
    $(location.hash).className = "active";
    $("#metrics").html('<h2 class="sub-header">Metrics</h2>');
    totalPercents = {};
    for (var i = 0; i < mets.length; i++) {
        curMet = getMet(username, mets[i], location.hash.substring(1));
        if (curMet[0] == "null") {
            addProg(mets[i].charAt(0).toUpperCase() + mets[i].substring(1), null, "Data not available.");
        } else {
            isvalid = true;
            addProg(mets[i].charAt(0).toUpperCase() + mets[i].substring(1), 100 * curMet[0]/curMet[1], curMet[0].toString() + " out of " + curMet[1].toString() + " " + curMet[2] + ".");
        }
    }
    if (isvalid == false) {
        $(".overview.progfill").css("background-color", "#F5F5F5");
        $(".overview.progfill").css("box-shadow", "0px 0px 0px 0px rgba(0, 0, 0, 0)");
        $(".overview.proglab").text("0%");
        $(".overview.progfill").css("width", "0%");
    }
    for(var i = 0; i < stats.length; i++) {
        var data = getJSON("http://vps.ritwikd.com:8081/" + username + "?type=data&metric=" + stats[i] + "&date=" + location.hash.substring(1));
            if (stats[i] == "weather") {
                if (data.value == "null") {
                    $("#metrics").append(wetNotTemp);
                } else {
                    $("#metrics").append(wetTemp);
                    respChart($(".met.canvas"), {
                        "labels": ["", "", "", "", "", "", "", "", "", "", "",  "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                        datasets: [
                            {
                                label: "Temps",
                                fillColor: " rgba(146, 255, 141, 1)",
                                strokeColor: "rgba(220,220,220,0.8)",
                                highlightFill: "rgba(220,220,220,0.75)",
                                highlightStroke: "rgba(220,220,220,1)",
                                data: data.temps
                            }
                        ]
                    });
                }

            } else if (stats[i] == "photos") {
                if (data.value == "null") {
                    $("#metrics").append(imNT);
                } else {
                    $("#metrics").append(imCT);
                    for (var j = 0; j < data.value.length; j++) {
                        $(".met.photos.progcont").append(imT[0] + data.value[j] + imT[1]);
                    }
                }

            }
    }
});
