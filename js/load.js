$(document).ready(function(){

    let pathPrefix = window.location.pathname.includes("/pages/") ? "../" : "./";

    $("#header").load(pathPrefix + "header.html", function(){
        $.getScript(pathPrefix + "js/nav.js");
        $.getScript(pathPrefix + "js/scroll.js");
    });

    $("#footer").load(pathPrefix + "footer.html");
});
