let clientColor;
let list;

window.addEventListener('load', function () {

    //Initialized the client color
    clientColor = 'black';

    //Created a function that generates a random hex value for colors
    //Reference https://dev.to/akhil_001/generating-random-color-with-single-line-of-js-code-fhj
    function generateRandomColor(){
        var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        return randomColor;
    }   

    let socket = io('/private');

    socket.on('connect', function () {
        console.log("Connected");
        //Generates random color for user
        clientColor = generateRandomColor();
    });

    //ask for room
    let room = window.prompt('Create or join a room!');
    console.log(room);

    //sending room name message to server
    socket.emit('room', {'roomName': room});

    //Adds counter with innerHTML to track users 
    socket.on('counter', function(counter){
        let countElement = document.getElementById('myCounter');
        countElement.innerHTML = "Travel Lovers Online: " + counter;
    });

    list = document.getElementById('allDestinations');

    //User joins a room
    socket.on('joined', function(data){
        console.log("Joined!");


        let currentRoom = document.getElementById('roomName');
        currentRoom.innerHTML = room;
    })

    socket.on('destination', function (data) {
        console.log("Message arrived!");
        console.log(data);

        addMsgToPage(data);

        
    });

    let userDestination = document.getElementById('user-destination');
    let submitButton = document.getElementById('submit-button');

    submitButton.addEventListener('click', function () {
        let myDestination = userDestination.value;
        let obj = { "destination": myDestination };
 
        socket.emit('destination', obj);
    });
});

function addMsgToPage(obj){
    let currDestination = obj.destination;
    let destinationElement = document.createElement('p');
    destinationElement.innerHTML = currDestination;
    //Adding the client color to the destination element that holds the data entered
    destinationElement.style.color = clientColor;

    list.appendChild(destinationElement);
    list.scrollTop = list.scrollHeight;
}

var particles = [];
var canvas;

function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
}

function setup() {
  canvas = createCanvas(windowWidth,windowHeight);
  canvas.position(0,0);
  noStroke();
  
}

function draw() {

  background(0);
  if(frameCount%2==0){
    particles.push(new Particle(random(10,45),random(30,45)));
    particles.push(new Particle(random(195, 220), random(195, 220)));
  }
  
  for(var i = particles.length - 1;i > 0;i--){
    var p = particles[i];  
    
    p.update();
    p.display();
    
    if(p.isOutside() || p.a <= -10){
      particles.splice(i,1);
    }
  }
  //console.log(particles.length);
  
  
}

class Particle{
  constructor(vx,vy){
    this.vx = vx;
    this.vy = vy;
    this.num = 255;
    this.a = 255;
    this.loc = createVector(width/2,height/2);
    this.vel = createVector(0,0);  
    this.acc = createVector(1,1);
  }

  update(){
    this.vel.add(this.acc);
    this.loc.add(this.vel);
    this.acc.mult(0);
    this.vel.limit(0.05);
    
  }
 

 
  isOutside(){
    if(this.loc.x < 0 ||this.loc.y>width || this.loc.y < 0 || this.loc.y >height){
      return true;
    }
    return false;
  }
  
  display(){
    this.acc = createVector(sin(radians(this.vx+this.num/2))/2,cos(radians(this.vy-this.num/2))/2);


    fill(255,this.a);
    var r = map(this.a,255,0,1,10);
    ellipse(this.loc.x,this.loc.y,r);
    
    this.num += map(this.a,255,0,1,0);
    this.a -= 0.1;
  }
  
 
}