var fs = require('fs');
var str1 = fs.readFileSync('index.html', 'utf8');

var express = require('express');
var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send(str1);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
