
var ssid = '---------------------';
var password = '-----------------';

var wifi = require('Wifi');
wifi.connect(ssid, {password: password}, function() {
    console.log('Connected to Wifi.  IP address is:', wifi.getIP().ip);
    wifi.save(); // Next reboot will auto-connect
});

function postJSON(postURL, data, callback) {
  content = JSON.stringify(data);
  var options = url.parse(postURL);
  options.method = 'POST';
  options.headers = {
    "Content-Type":"application/json",
    "Content-Length":content.length
  };
  var req = require("http").request(options, function(res)  {
    var d = "";
    res.on('data', function(data) { d+= data; });
    res.on('close', function(data) { callback(d); });
  });
  req.on('error', function(e) {
    callback();
  });
  req.end(content);
}

let dht = require("DHT11").connect(D15);

function getDHT(){
  dht.read(function (a) {
    temp = a.temp.toString();
    rh = a.rh.toString();
  });
}

let temp;
let rh;

function post(){
  getDHT();
  postJSON("http://readnow.vulkanclub.tech/postValue", {
    "title": "Tunnel project",
    "pos1param": {
        "name": "Temperature",
        "ext": "C",
        "value": temp
     },
     "pos2param": {
        "name": "Humidity",
        "ext": "%",
        "value": rh
     },
     "pos3param": {
        "name": "Fan speed",
        "ext": "rp",
        "value": 277
     },
     "id": "5c73c132610cc44e5e2cc062"
}, function(d) {
  console.log("Response: "+d);
});
}

setInterval(post, 7000);
