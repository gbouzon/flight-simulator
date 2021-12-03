//global variables

//for canvas
var cnv;
var ctx;
var flights = new Array();
//array of flights
var arrFlights = new Array();
//nb of steps in which each flight must reach destination
var nbSteps = 100;
//background image (map)
var backgroudImage = new Image();
backgroudImage.src = "img/Canada-1280-1107.png";
//timer to keep track of departuretime
var timer = 0;
//default image for planes that don't depart from one of the cities in alternateDepartures
var defaultImage = "img/plane.jpg";
//to be used for alternateDepartures
var alternateImage = "";
var alternateDepartures = ["charlottetown", "edmonton", "fredericton", "halifax", "ottawa", "quebec", "regina", "stjohn", "toronto", "victoria", "winnipeg"];

//constructor for plane objects
function Plane(xCoordinate, yCoordinate, imageSrc = defaultImage, destX, destY) { //giving default image, test in createPlane()
    this.step = 0;
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
    this.imageSrc = imageSrc;
    this.imageWidth = 20;
    this.imageHeight = 20;
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
        this.step++;
        this.xCoordinate += this.xMove;
        this.yCoordinate += this.yMove;
        this.draw();

        if (this.step == 100)
           removePlane(this);
    }
}

function removePlane(item) {
    var index = arrFlights.indexOf(item);
    if (index !== -1)
        arrFlights.splice(index, 1);
}

function getInformation() { 
    $.get("capitals.json", function(data) {
        flights= data.flights;
    });
}

function createPlanes(flights) {
    for (var i = 0; i < flights.length; i++) {
        var flight = flights[i];
        if (flight.departureTime == timer) {
            //do switch for this later cause that's what teacher wants
            //get original extensions back
            if (isAlternateDeparture(flight.departure.toLowerCase().replace(/[\s.]/g, ''))) //removes whitespace and dots
                alternateImage = "img/" + flight.departure.toLowerCase().replace(/[\s.]/g, '') + ".jpg"; //fix extension (some are jpg and some are png)
            else 
                alternateImage = defaultImage;

            arrFlights.push(new Plane(parseInt(flight.departureX), parseInt(flight.departureY), alternateImage, parseInt(flight.arrivalX), parseInt(flight.arrivalY)));   
        }            
    }
}

/**
 * Checks if the departure city is one of the following alternate departures:
 * Charlottetown, Edmonton, Fredericton, Halifax, Ottawa, Quebec, Regina, St. John, Toronto, Victoria, Winnipeg
 * @param {string} departure 
 * @returns true if the specified departure is one of the alternate departures
 */
function isAlternateDeparture(departure) {
    if (alternateDepartures.indexOf(departure) === -1)
        return false;
    return true;
}

$(document).ready(function() {
    cnv = document.getElementById("mapCanvas");
    ctx = cnv.getContext("2d");
    ctx.drawImage(backgroudImage, 0, 0, cnv.width, cnv.height);
    getInformation(); //initializes flights array (info from jason)
    
    $("#mapCanvas").click(function() {
        setInterval(function() {
            //figure this out later
            //apparently this is right? just do a test script pls your ocd can't handle this
            timer++;
            createPlanes(flights);
            ctx.clearRect(0, 0, cnv.width, cnv.height);
            ctx.drawImage(backgroudImage, 0, 0, cnv.width, cnv.height);
            
            for (var i = 0; i < arrFlights.length; i++)          
                arrFlights[i].move();

            console.log(arrFlights.length);
        }, 75);
    });  
});