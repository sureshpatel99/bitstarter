var fs = require('fs');
var express = require('express');
var infile = "index.html";

buf = new Buffer(256);

var str1 = buf.toString(fs.readFileSync(infile));

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send(str1);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
