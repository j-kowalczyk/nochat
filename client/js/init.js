var io = io || function(){};
var $ = $ || {};
var socket = io();

$('form').submit(function(){
    "use strict";
    var m = $('#m');
    socket.emit('chat message', m.val());
    m.val('');
    return false;
});
socket.on('chat message', function(msg){
    "use strict";
    $('#messages').append($('<li>').text(msg));
});

