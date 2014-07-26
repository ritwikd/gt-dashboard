fillDates();

$(".date.item").on('click', function() {
    console.log("test");
    $(".date.item").attr("class", "date item");
    $(this).attr("class", "date item selected");
});