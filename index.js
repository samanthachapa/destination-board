let express = require('express');
let app = express();
app.use('/', express.static('public'));

let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

let io = require('socket.io');
io = new io.Server(server);
let private = io.of('/private');

function generateRandomColor(){
    var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    return randomColor;
}   

io.sockets.on('connection', function(socket) {

    let clientColor = generateRandomColor();

    //Created a counter to keep track of the amount of users on the page using io.engine 
    //io.engine.clients refernce https://stackoverflow.com/questions/10275667/socket-io-connected-user-count
    let counter = io.engine.clientsCount;
    io.sockets.emit('counter', counter);
    console.log(counter);

    //Keeping track of incoming clients
    console.log("We have a new client: " + socket.id);

    //Sending client data from the server to all clients
    socket.on('destination', function(data) {
        console.log("Received a 'destination' event");
        console.log(data);

        io.sockets.emit('destination', data);
    });

    socket.on('joinRoom', function(roomName){
        socket.join(roomName);
    })

    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });
});

//Connection to private
private.on('connection', function(socket) {

    socket.on('room', function(data){
        console.log("A room name was submitted!");
        console.log(data.roomName);

        socket.join(data.roomName);
        socket.roomName = data.roomName;

        let welcomeMsg = "New User has joined" + data.roomName;

        private.to(data.roomName).emit("joined",{"msg": welcomeMsg});
    })
    let clientColor = generateRandomColor();

    //Created a counter to keep track of the amount of users on the page using io.engine 
    //io.engine.clients refernce https://stackoverflow.com/questions/10275667/socket-io-connected-user-count
    let counter = io.engine.clientsCount;
    io.sockets.emit('counter', counter);
    console.log(counter);

    //Keeping track of incoming clients
    console.log("We have a new client: " + socket.id);

    //Sending client data from the server to all clients
    socket.on('destination', function(data) {
        console.log("Received a 'destination' event");
        console.log(data);

        let currRoom = socket.roomName;

        private.to(currRoom).emit('destination', data);
    });

    socket.on('joinRoom', function(roomName){
        socket.join(roomName);
    })

    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });
});