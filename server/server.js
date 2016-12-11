var app = require('express')(),
    express = require('express'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    port = process.argv[2] || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(__dirname + '/../client'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('user się podłączył');
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
    socket.on('disconnect', function(){
        console.log('user się rozłączył');
    });
    socket.broadcast.emit('hi');

});

http.listen(port, function () {
    console.log(`listening on *: ${port}`);
});
