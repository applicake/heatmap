var HEATMAP = HEATMAP || {};

HEATMAP.Server = new function() {
  var x_min = 0;
  var y_min = 0;
  var x_max = 0;
  var y_max = 0;
  var RADIUS = 20;
  var INTENSITY = 0.2;

  //Util function - creates tiny linear gradient line
  function createColourGradient() {
    var ctx = document.createElement('canvas').getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, 256, 0);
    grd.addColorStop(0.0, 'magenta');
    grd.addColorStop(0.25, 'blue');
    grd.addColorStop(0.5, 'green');
    grd.addColorStop(0.75, 'yellow');
    grd.addColorStop(1, 'red');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 256, 1);
    return ctx.getImageData(0, 0, 256, 1).data;
  }

  function setExtremes(x, y) {
    if (x < x_min) {
      x_min = x;
    }

    if (x > x_max) {
      x_max = x;
    }

    if (y < y_min) {
      y_min = y;
    }

    if (y > y_max) {
      y_max = y;
    }
  }

  //Create black point with alpha
  function drawBlackPoint(x, y) {
    if (x > 0) {
      setExtremes(x + RADIUS, y + RADIUS);
      var ctx = document.getElementById('canvas').getContext('2d');
      var grd = ctx.createRadialGradient(x, y, 0, x, y, RADIUS);
      grd.addColorStop(0.0, 'rgba(0, 0, 0, ' + INTENSITY  + ')');
      grd.addColorStop(1.0, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(x - RADIUS, y - RADIUS, RADIUS*2, RADIUS*2);
    }
  }

  //Putting some colors on canvas.
  function heatMapOverlay(x_min, x_max, y_min, y_max) {
    var ctx = document.getElementById('canvas').getContext('2d');
    var imageData = ctx.getImageData(
      x_min,
      y_min,
      x_max - x_min,
      y_max - y_min);
    var data = imageData.data;
    var colorGradient = createColourGradient();

    for (var i = 0; i < data.length; i += 4) {
      var a = data[i + 3] * 4;
      data[i] = colorGradient[a];
      data[i + 1] = colorGradient[a + 1];
      data[i + 2] = colorGradient[a + 2];
    }

    ctx.putImageData(imageData, x_min, y_min);
    ctx.fillRect(x_min, y_min, x_max - x_min, y_max - y_min);
  }

  this.init = function(){
    window.addEventListener('load', function(){
      var socket = io.connect();
      socket.on('paint', function(data){
        drawBlackPoint(data.x, data.y);
        heatMapOverlay(x_min, x_max, y_min, y_max);
      });
      socket.on('canvas', function(data){
        document.getElementById('canvas').style.left = "" +
          Math.floor((document.body.clientWidth - 900) / 2) + "px";
        document.getElementById('canvas').width = data.width;
        document.getElementById('canvas').height = data.height;
        document.getElementById('heatmap-iframe').height = data.height;
      });
    });
  }
};
