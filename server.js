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

io.configure(function(){
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

app.get('/', function (req, res) {
  //res.sendfile(__dirname + '/index.html');
  res.render('index.jade', {client: ''})
});

app.get('/heatmap-client', function (req, res) {
  res.sendfile(__dirname + '/heatmap-client.js');
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Listening on ' + port);
});

io.sockets.on('connection', function (socket) {
  socket.on('click', function (data) {
    socket.broadcast.emit('paint', data);
  });
  socket.on('dimensions', function(data){
    socket.broadcast.emit('canvas', data);
  });
});
