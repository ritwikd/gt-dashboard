
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
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
  };

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

var dkey;
var date = new Date();
location.hash = "#" + date.gDate();
var curMet;
var mets = getMets("RitwikDutta");
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
    for (var i = 0; i < mets.length; i++) {
        curMet = getMet("RitwikDutta", mets[i], location.hash.substring(1));
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
});

