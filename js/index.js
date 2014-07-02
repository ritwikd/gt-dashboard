var print = function(inp) { console.log(inp); }

var elemTemp = ['<div class = "metcont">' +
                '<div class = "met ',' mettitle">',
                '<p class = "met ',
                ' progdesc"></div><div class = "met ', 
                ' progcont"><div class = "met ', ' progbase"></div>' 
                +'<div class = "met ',
                ' progfill"></div></div><p class = "met ', 
                ' proglab" >0%</p></p></div>'];

var totalPercents = {};

var addMetric = function(elemClass, metTitle) {
    var div = elemTemp[0] + elemClass;
    div += elemTemp[1] + metTitle;
    div += elemTemp[2] + elemClass;
    div += elemTemp[3] + elemClass;
    div += elemTemp[4] + elemClass;
    div += elemTemp[5] + elemClass;
    div += elemTemp[6] + elemClass;
    div += elemTemp[7];
    $("#metrics").append(div);
    setTimeout( 
        function() {
            $(".metcont").css("opacity", "1");
        }, 100);
};

var setMainProg = function() {
    var res = 0;
    var num = 0;
    $.each(totalPercents, function(i) { res += totalPercents[i]; num++; });
    var amt = res/num;
    $(".overview.progfill").css("background-color", getCol(amt));
    $(".overview.progfill").css("box-shadow", "0px 7px 0px 0px " + getShadCol(amt));
    $(".overview.proglab").text(Math.round(amt).toString() + "%");
    if (amt > 100) {
        amt = 100;
    }
    $(".overview.progfill").css("width", (amt/100) * parseInt($(".overview.progbase").css("width")));
    print(amt);
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
    bar.css("background-color", getCol(progAmt));
    bar.css("box-shadow", "0px 7px 0px 0px " + getShadCol(progAmt));
    label.text(Math.round(progAmt).toString() + "%");
    totalPercents[elemClass] = progAmt;
    if (progAmt > 100) {
        progAmt = 100;
    }
    bar.css("width", (progAmt / 100) * parseInt(base.css("width")));
    desc.text(descUp);
    setMainProg();
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

var user = getJSON("http://vps.ritwikd.com:8081/getuser=Ritwik%20Dutta");
var metdat  = [];
$.each(user.metrics, function(item) {
    print(item);
    metdat.push(getJSON("http://vps.ritwikd.com:8081/getmet=" + item + "&user=" + user.name + "&date=20140613"));
});
print(metdat);



