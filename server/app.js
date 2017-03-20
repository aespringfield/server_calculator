// add requires and global variables
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var calculate = require("./modules/calculate.js");
var result;

app.set("port", 4000);

// uses
app.use(express.static("server/public"));
// change this to module?
app.get("/", function(req, res){
  res.sendFile(path.resolve("server/public/views/index.html"));
});
// change this to module?
app.post("/calculate/:x/:y/:type", function(req, res){
  var x = req.params.x;
  var y = req.params.y;
  var type = req.params.type;
  console.log("x is", x, "\ny is", y, "\ntype is", type);
  result = calculate(x, y, type);
  console.log("result is", result, "\n");
  res.sendStatus(200);
});

app.get("/result", function(req, res){
  res.send(result);
});


// spin up server
app.listen(app.get("port"), function() {
  console.log("Listening on port:", app.get("port"));
});
