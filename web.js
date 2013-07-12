var express = require('express');

var fs = require('fs');
var infile = "index.html";

var str1 = fs.readFileSync(infile, {encoding: 'utf8'});

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send(str1);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
