console.log("hi")
$(function () {
    $("input[type=color]").change(function (e) {
        alert(e.target.value);
    });
});
