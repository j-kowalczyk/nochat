var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.argv[2] || 3000;

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
