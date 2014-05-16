/*jslint node:true*/
var port = (process.env.VCAP_APP_PORT || 3000);
var express = require("express");

var app = express();
// Configure the app web container
app.configure(function() {
    app.use(express.static(__dirname + '/public'));
});

app.listen(port);
console.log("Server listening on port " + port);