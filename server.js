var express = require('express');
var app = express.createServer()
, io = require('socket.io').listen(app)
, http = require('http')

app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(__dirname));
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

var options = {
  host: 'www.applicake.com',
  port: 80,
  path: '/'
}

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/heatmap-client', function (req, res) {
  res.sendfile(__dirname + '/heatmap-client.js');
});

app.listen(8080);

io.sockets.on('connection', function (socket) {
  socket.on('click', function (data) {
    socket.broadcast.emit('paint', data);
  });
  socket.on('dimensions', function(data){
    socket.broadcast.emit('canvas', data);
  });
});
