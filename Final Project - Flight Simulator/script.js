//global variables
var cnv = document.getElementById("myCanvas"); //gets canvas
var ctx = cnv.getContext("2d"); //sets context to 2d

var backgroudImage = new Image(1280, 1107);
backgroundImage.src = "Canada-1280-1107.png";

$(document).ready(function() {
    ctx.drawImage(img, 0, 0, cnv.width, cnv.height);
});