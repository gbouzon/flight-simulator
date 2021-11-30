//global variables
var cnv;
var ctx;
var plane;
var arrFlights = new Array();
var nbSteps = 100;
var backgroudImage = new Image();
backgroudImage.src = "img/Canada-1280-1107.png";

function Plane(xCoordinate, yCoordinate, imageSrc = "img/plane.jpg") {
    this.step = 0;
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
    this.imageSrc = imageSrc;
    this.imageWidth = 40;
    this.imageHeight = 40;
    this.destX = 500;
    this.destY = 500;
    this.xMove = (this.destX - this.xCoordinate)/100;
    this.yMove = (this.destY - this.yCoordinate)/100;
    this.draw = function() {
        var planeImage = new Image();
        planeImage.src = this.imageSrc;
        ctx.drawImage(planeImage, this.xCoordinate, this.yCoordinate, this.imageWidth, this.imageHeight);
    }
    this.move = function() {
        if (this.step < nbSteps) {
            this.step++;
            this.xCoordinate += this.xMove;
            this.yCoordinate += this.yMove;
            this.draw();
        }
    }
}

$(document).ready(function() {
    cnv = document.getElementById("mapCanvas");
    ctx = cnv.getContext("2d");
    ctx.drawImage(backgroudImage, 0, 0, cnv.width, cnv.height);

    $("#mapCanvas").click(function() {

        plane = new Plane(Math.random() * 1000, Math.random() * 533);
        //plane.draw();
        setInterval(function(){ 
            ctx.clearRect(0,0, cnv.width, cnv.height);
            ctx.drawImage(backgroudImage, 0, 0, cnv.width, cnv.height);
            plane.move();
            
        }, 75);
        
    });

    $.get("capitals.json", function(data) {
        for (var i = 0; i < data.flights.length; i++){
            console.log(data.flights[i]);
        }
    });
});