var express = require('express');
var app = express.createServer()
, io = require('socket.io').listen(app)
, http = require('http');

//Express configuration
app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(__dirname));
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

//Websockets are not supported by Heroku, so I have to change it
//temporary to polling strategy. Hope to get access to Nodester or
//Nodecloud soon.

io.configure(function(){
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

//Enabling jade.
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
  //Broadcasting click and canvas dimensions (probably should be
  //changed in the future to something more appropriate)

  socket.on('click', function (data) {
    socket.broadcast.emit('paint', data);
  });
  socket.on('dimensions', function(data){
    socket.broadcast.emit('canvas', data);
  });
});
