var express = require('express');
var app = express.createServer()
, io = require('socket.io').listen(app)
, http = require('http');

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
app.set ('view engine', 'jade');
app.set('view options', {
  layout: false
});
app.get('/', function (req, res) {
  var server = process.env.HEATMAP_CLIENT || 'http://localhost:3000'
  res.render('index' , { client_server: server});
});

app.get('/heatmap-client', function (req, res) {
  res.sendfile(__dirname + '/heatmap-client.js');
});

var port = process.env.PORT || 8080;
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
