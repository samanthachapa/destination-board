window.addEventListener('load', function () {

    //Initialized the client color
    let clientColor = 'black';

    //Created a function that generates a random hex value for colors
    //Reference https://dev.to/akhil_001/generating-random-color-with-single-line-of-js-code-fhj
    function generateRandomColor(){
      var randomColor = '#000000'
      return randomColor;
    }   

    let socket = io('/nyc');
    let username = prompt("Enter a username" , "Username");

    socket.on('connect', function () {
        console.log("Connected");
        //Generates random color for user
        clientColor = generateRandomColor();
    });

    //Adds counter with innerHTML to track users 
    socket.on('counter', function(counter){
        let countElement = document.getElementById('myCounter');
        countElement.innerHTML = "Travel Lovers Online: " + counter;
    });

    let list = document.getElementById('allDestinations');

    socket.on('destination', function (data) {
        console.log("Message arrived!");
        console.log(data);

        let currDestination = data.destination;
        let destinationElement = document.createElement('p');
        destinationElement.innerHTML = data.username + ": " + currDestination;
        //Adding the client color to the destination element that holds the data entered
        destinationElement.style.color = clientColor;

        list.appendChild(destinationElement);
        list.scrollTop = list.scrollHeight;
    });

    let userDestination = document.getElementById('user-destination');
    let submitButton = document.getElementById('submit-button');

    submitButton.addEventListener('click', function () {
        let myDestination = userDestination.value;
        let obj = { "destination": myDestination, "username": username};
 
        socket.emit('destination', obj);
    });
});


//p5 sketch
let data = ["Favorite coffee shop?",
            "Favorite restaurant?",
            "Have you visited this city?",
            "Any tour recommendations?",
            "Do you need to speak the language to visit?",
            "What parts of the culture did you experience?",
            "Hotel recommendations?",
            "Favorite tourist attraction?",
            "Any picture perfect spots?",
            "Favorite bar?",
            "Night life?",
            "Easy to get around?",
            "Best park/outdoor place?",
            "Public transportation?",
            "Safety conerns?",
            "Museums?",
            "Art Galleries?"];
let i = 0;
var canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index','-1');
  background(0);
  fill(255);
  frameRate(0.65);
  textAlign(CENTER);
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}

function draw() {

  if(i > data.length) {
  	background(0);
    fill(255);
    i = 0;
  }

  // place text at a random place
  textSize(random(20,70));
  text(data[i], random(width), random(height));
  

  i = i + 1;
}