var HEATMAP = HEATMAP || {};
HEATMAP.Client = new function() {
  this.init = function(server, width, height) {
    window.addEventListener('load', function(){
      var socket = io.connect(server);
      socket.on('connect', function(){
        socket.emit('dimensions',{width: width, height: height});
      });
      document.body.onmousedown =  function(event){
        socket.emit('click', {
          x: event.x - Math.floor((document.body.clientWidth-900)/2),
          y: event.y + document.body.scrollTop
        });
      }
    });
   }
}
