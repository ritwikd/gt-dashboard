var totalPercents = {};

var setMainProg = function() {
    var res = 0;
    var num = 0;
    $.each(totalPercents, function(i) { res += totalPercents[i]; num++; });
    var amt = res/num;
    $(".overview.progfill").css("background-color", getCol(amt));
    $(".overview.proglab").text(amt.toString() + "%");
    if (amt > 100) {
        amt = 100;
    }
    $(".overview.progfill").css("width", amt.toString() + "%");
    console.log(amt);
};

var setProg = function(elemClass, progAmt, descUp) {
    var bar = $(elemClass + ".progfill");
    var label = $(elemClass + ".proglab");
    var desc = $(elemClass + ".progdesc");
    bar.css("background-color", getCol(progAmt));
    label.text(progAmt.toString() + "%");
    totalPercents[elemClass] = progAmt;
    if (progAmt > 100) {
        progAmt = 100;
    }
    bar.css("width", progAmt.toString() + "%");
    desc.text(descUp);
    setMainProg();
};

var getCol = function(progAmt) {
    return (progAmt < 50) ? "#F75E5E" : (progAmt < 80) ? "#F2EF4B" : "#5EE66E";
};

$(".progfill").mouseover(function() {
    console.log(this);
}, function() {
    this.css("width", this.css("width") * 0.75);
});

