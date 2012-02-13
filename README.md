# Heatmap - live generated click-heatmap

Using Node.js with websockets (socket.io), and display with HTML5

## Client side

Requirements:

``` html
<script src="http://YOUR_NODE_JS_SERVER/socket.io/socket.io.js"></script>
<script src="http://YOUR_NODE_JS_SERVER/heatmap-client"></script>
```

Port is mandatory, even if it's 80
Canvas dimensions limiting the size of heatmap (it's automatically
centered and aligned to the top)

``` javascript
HEATMAP.Client.init('YOUR_NODE_JS_SERVER:PORT', CANVAS_WIDTH, CANVAS_HEIGHT);
```

## Server side

There is prepared view/index.jade file. All you need is to provide
site which is analyzed by setting env variable, for example:

export HEATMAP_CLIENT="http://www.applicake.com"
