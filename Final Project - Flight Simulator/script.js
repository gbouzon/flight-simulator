//global variables
var cnv; //canvas
var ctx; //canvas context
var flights = new Array(); //from json
var arrFlights = new Array(); //for creating Plane objects
var nbSteps = 100; //set according to problem statement
var backgroudImage = new Image(); //map
backgroudImage.src = "img/Canada-1280-1107.png";
var timer = 0; //to keep track of departure time

//constructor for plane objects
function Plane(xCoordinate, yCoordinate, destX, destY, imageSrc = "img/plane.jpg") {
    this.step = 0;
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
    this.imageSrc = imageSrc;
    this.imageWidth = 30;
    this.imageHeight = 30;
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

        if (this.step >= 100)
           removePlane(this);
    }
}

/**
 * Removes Plane object from array (after making sure it is an element in the actual flight array)
 * @param {Plane} item 
 */
function removePlane(item) {
    var index = arrFlights.indexOf(item);
    if (index !== -1)
        arrFlights.splice(index, 1);
}

/**
 * Gets information from json file and stores it into flights array
 * @return {void}
 */
function getInformation() { 
    $.get("capitals.json", function(data) {
        flights = data.flights;
    });
}

/**
 * Creates Plane objects and adds them to flight array
 * @param {Plane[]} flights 
 * @return {void}
 */
function createPlanes() {
    for (var i = 0; i < flights.length; i++) 
        if (parseInt(flights[i].departureTime) === timer) {
            var departure = flights[i].departure.toLowerCase().replace(/[\s.-]/g, ''); //removes whitespace and dots
            arrFlights.push(new Plane(parseInt(flights[i].departureX), 
                                    parseInt(flights[i].departureY), 
                                    parseInt(flights[i].arrivalX), 
                                    parseInt(flights[i].arrivalY),
                                    setImageFile(departure)));   
        }            
}

/**
 * sets the right image extension depending on location of flight departure
 * @param {string} departure 
 * @returns respective image file path
 */
function setImageFile(departure) {
    switch(departure) {
        case "charlottetown": case "edmonton": case "halifax": case "regina": case "stjohn": case "toronto": case "victoria": case "winnipeg":
            return "img/" + departure + ".jpg";
        case "fredericton": case "ottawa": case "quebec":
            return "img/" + departure + ".png"; ; 
    }
}

$(document).ready(function() {
    cnv = document.getElementById("mapCanvas");
    ctx = cnv.getContext("2d");
    ctx.drawImage(backgroudImage, 0, 0, cnv.width, cnv.height);
    getInformation(); //initializes flights array (info from json)

    $("#mapCanvas").click(function() {
        setInterval(function() {
            timer++;
            createPlanes();
            ctx.clearRect(0, 0, cnv.width, cnv.height);
            ctx.drawImage(backgroudImage, 0, 0, cnv.width, cnv.height);
            
            for (var i = 0; i < arrFlights.length; i++)          
                arrFlights[i].move();
        }, 75);
    });  
});