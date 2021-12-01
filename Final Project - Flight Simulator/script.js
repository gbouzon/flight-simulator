//global variables
var cnv;
var ctx;
var arrFlights = new Array();
var nbSteps = 100;
var backgroudImage = new Image();
var timer = 0;
var defaultImage = "img/plane.jpg";
var alternateImage = "";
var alternateDepartures = ["charlottetown", "edmonton", "fredericton", "halifax", "ottawa", "quebec", "regina", "stjohn", "toronto", "victoria", "winnipeg"];
backgroudImage.src = "img/Canada-1280-1107.png";

function Plane(xCoordinate, yCoordinate, imageSrc, destX, destY) {
    this.step = 0;
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
    this.imageSrc = imageSrc;
    this.imageWidth = 40;
    this.imageHeight = 40;
    this.destX = destX;
    this.destY = destY;
    this.xMove = (this.destX - this.xCoordinate) / nbSteps;
    this.yMove = (this.destY - this.yCoordinate) / nbSteps;

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

function removePlane(item) {
    var index = arrFlights.indexOf(item);
    if (index !== -1)
        arrFlights.splice(index, 1);
}

function createPlanes() {
    $.get("capitals.json", function(data) {
        for (var i = 0; i < data.flights.length; i++) {
            var flight = data.flights[i];
            if (flight.departureTime == timer) {

                if (isAlternateDeparture(flight.departure.toLowerCase().replace(/[\s.]/g, ''))) //removes whitespace and dots
                    alternateImage = "img/" + flight.departure.toLowerCase().replace(/[\s.]/g, '') + ".jpg";
                else 
                    alternateImage = defaultImage;

                arrFlights.push(new Plane(flight.departureX, flight.departureY, alternateImage, flight.arrivalX, flight.arrivalY));   
            }            
        }
    });
}

function isAlternateDeparture(departure) {
    if (alternateDepartures.indexOf(departure) === -1)
        return false;
    return true;
}

$(document).ready(function() {
    cnv = document.getElementById("mapCanvas");
    ctx = cnv.getContext("2d");
    ctx.drawImage(backgroudImage, 0, 0, cnv.width, cnv.height);

    $("#mapCanvas").click(function() {

        //var plane = new Plane(645, 245, defaultImage, 336, 417);
        //arrFlights.push(plane);
        //plane.draw();
         
        setInterval(function() {
            //figure this out later
            timer++;
            createPlanes();
            //if (arrFlights[0] != null) {
             //   arrFlights[0].draw();
                //arrFlights[0].move();
          //  }
                
           // ctx.clearRect(0,0, cnv.width, cnv.height);
            //ctx.drawImage(backgroudImage, 0, 0, cnv.width, cnv.height);
            //doesn't work ???
            for (var i = 0; i < arrFlights.length; i++) {
               arrFlights[i].draw();
            //    arrFlights[i].move();
            }
  
            
        }, 75);
        
    });

    
});