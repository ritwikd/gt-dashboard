var totalPercents = {};

var setMainProg = function() {
    var res = 0;
    var num = 0;
    $.each(totalPercents, function(i) { res += totalPercents[i]; num++; });
    var amt = res/num;
    $(".overview.progfill").css("background-color", getCol(amt));
    $(".overview.progfill").css("width", amt.toString() + "%");
    $(".overview.proglab").text(amt.toString() + "%");
    console.log(amt);
};

var setProg = function(elemClass, progAmt, descUp) {
    var bar = $(elemClass + ".progfill");
    var label = $(elemClass + ".proglab");
    var desc = $(elemClass + ".progdesc");
    bar.css("background-color", getCol(progAmt));
    bar.css("width", progAmt.toString() + "%");
    label.text(progAmt.toString() + "%");
    totalPercents[elemClass] = progAmt;
    desc.text(descUp);
    setMainProg();
};

var getCol = function(progAmt) {
    return (progAmt < 50) ? "#F75E5E" : (progAmt < 80) ? "#F2EF4B" : "#5EE66E";
};


