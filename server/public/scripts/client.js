// temporary global variables
var xVal;
var yVal;
var typeOp;

var currentCalcObject = new CalcObject(xVal, yVal, typeOp);

// run functions on ready
$(document).ready(function() {
  listenForClicks();
});


// event handlers
function listenForClicks() {
  addDigit();
  setOperator();
  startCalculation();
  clearResult();
}

// when number button is clicked, adds digit to result bar and stores its value
function addDigit() {
  $(".number").on("click", function() {
    var digit = $(this).data("value");
    var displayText = $(".result-text").text();
    displayText += digit;
    $(".result-text").text(displayText);
    console.log("displayText:", displayText);
  });
}

// attach operator to a data-type attribute in equals div when clicked
// take data-value from results bar and attach it to data-x in equals div
// clear results bar & data-value for results bar
function setOperator() {
  $(".operator").on("click", function() {
    var operator = $(this).data("operator");
    console.log(operator);
    $("#equals").data("type", operator);
    storeOperand("x");
  });
}

// when clear div is clicked, empty old result-text
function clearResult() {
  $("#clear").on("click", function() {
    console.log("clear");
    $(".result-text").empty();
    $("form").trigger("reset");
  });
}

// when equals div is clicked, create calculation object and send to server
function startCalculation() {
  $("#equals").on("click", function() {
    console.log("equals");
    storeOperand("y");
    var x = $(this).data("x");
    var y = $(this).data("y");
    var type = $(this).data("type");
    console.log("x:", x, "; y", y, "; type:", type);
    if (type) {
      console.log(type);
      var calcObject = new CalcObject(x, y, type);
      console.log(calcObject);
      postCalcObject(calcObject);
    } else {
      $(".result-text").text("Please select an operator");
    }
  });
}

// retrieve value from input field and convert to number
function retrieveInput(id) {
  var inputValue = $("#" + id).val();
  inputValue = parseInt(inputValue);
  return inputValue;
}

// calculation object constructor
function CalcObject(x, y, type) {
  this.x = x;
  this.y = y;
  this.type = type;
}

// use ajax post to send object to server
function postCalcObject(calcObject) {
  $.ajax({
    type: "POST",
    url: "/calculate/" + calcObject.x + "/" + calcObject.y + "/" + calcObject.type,
    data: calcObject,
    success: function(response) {
      console.log("Successful post!");
      console.log("Response is", response);
      retrieveResult();
    }
  });
}

// use ajax get to retrieve calculated result from server
function retrieveResult() {
  $.ajax({
    type: "GET",
    url: "/result",
    success: function(response) {
      console.log("Successful get!");
      console.log("Response is", response);
      displayResult(checkNaN(response));
    }
  });
}

// checks if response is not a number and changes response accordingly
function checkNaN(response) {
  if (isNaN(response)) {
    response = "ERROR: input must be number values";
  }
  return response;
}

// change result-text to new result
function displayResult(response) {
  $(".result-text").text(response);
}

// concatenate digits entered by user with existing data-value in results bar
function concatInput(digit) {
  var $result = $(".result");
  var inputSoFar = $result.data("value");
  $result.data("value", inputSoFar + digit);
}

// stores first operand in data-x or data-y in equals div
function storeOperand(attribute) {
  var operand = $(".result-text").text();
  $("#equals").data(attribute, operand);
  $(".result-text").empty();
}
