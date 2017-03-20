// timer for "calculating" message
var calcMsgTimer;

// run functions on ready
$(document).ready(function() {
  listenForClicks();
});

// event handlers
function listenForClicks() {
  addDigit();
  setOperator();
  checkForEquals();
  checkForClear();
}

// when number button is clicked, adds digit to display-bar and stores its value
function addDigit() {
  $(".number").on("click", function() {
    clearResult();
    var digit = $(this).data("value");
    concatInput(digit);
    var newValue = $(".display-bar").data("currentInput");
    displayValue(newValue);
  });
}

// clear data-result attribute in display-bar
function clearResult() {
  $(".display-bar").data("result", "");
}

// concatenate digits entered by user with existing data value for currentInput in display-bar
function concatInput(digit) {
  var $display = $(".display-bar");
  var inputSoFar = $display.data("currentInput");
  if (inputSoFar === undefined) {
    inputSoFar = "";
  }
  $display.data("currentInput", "" + inputSoFar + digit);
}

// change display-text to new result
function displayValue(value) {
  $(".display-text").text(value);
}

// when operator button is clicked, change data value for "operator" in display-bar
// take currentInput from display-bar and attach it to data-x in equals div
// clear display-text & currentInput
// return error message if multiple operators are clicked
// return error message if operator clicked before first input
function setOperator() {
  $(".operator").on("click", function() {
    clearResult();
    if($(".display-bar").data("x")) {
      clearAll();
      $(".display-text").text("ERROR: Cannot select multiple operators");
    } else if ($(".display-bar").data("currentInput") === "") {
      clearAll();
      $(".display-text").text("ERROR: Must select first input");
    } else {
      storeOperand("x");
      var operator = $(this).data("operator");
      $(".display-bar").data("type", operator);
    }
  });
}

// empties display-bar text & data attributes
function clearAll() {
  $display = $(".display-bar");
  $display.find(".display-text").empty();
  $display.data("result", "");
  $display.data("currentInput", "");
  $display.data("x", "");
  $display.data("y", "");
  $display.data("type", "");
}

// stores first operand in data-x or data-y in equals div
function storeOperand(dataVal) {
  var operand = $(".display-bar").data("currentInput");
  $(".display-bar").data(dataVal, operand);
  $(".display-bar").data("currentInput", "");
}

// when equals button is clicked, store second operand and make calculation
function checkForEquals() {
  $("#equals").on("click", function() {
    storeOperand("y");
    makeCalculation();
  });
}

// create calculation object and send to server
// if there are not 2 valid inputs, returns false, clears input, and displays an error message
function makeCalculation() {
  console.log("calculating");
  var calcObject = createCalcObject();
  if (checkInput(calcObject.x, calcObject.y)) {
    console.log("x:", calcObject.x, "; y:", calcObject.y, "; type:", calcObject.type);
    postCalcObject(calcObject);
  } else {
    clearAll();
    $(".display-text").text("ERROR: Must have 2 number inputs");
  }
}

// create object to post to server with 2 inputs and operation type
function createCalcObject() {
  var $display = $(".display-bar");
  var x = $display.data("x");
  var y = $display.data("y");
  var type = $display.data("type");
  var calcObject = new CalcObject(x, y, type);
  return calcObject;
}

// calculation object constructor
function CalcObject(x, y, type) {
  this.x = x;
  this.y = y;
  this.type = type;
}

// check 2 inputs to see if they both exist and are numbers
function checkInput(x, y) {
  if (isNaN(parseFloat(x)) || isNaN(parseFloat(y))) {
    return false;
  } else {
    return true;
  }
}

// use ajax post to send object to server
// display "caculating" message
// call retrieveResult after 3 seconds
function postCalcObject(calcObject) {
  $.ajax({
    type: "POST",
    url: "/calculate/" + calcObject.x + "/" + calcObject.y + "/" + calcObject.type,
    data: calcObject,
    success: function(response) {
      calcMsgTimer = setInterval(retrieveResult, 3000);
      displayValue("CALCULATING...");
    }
  });
}

// use ajax get to retrieve calculated result from server
function retrieveResult() {
  clearInterval(calcMsgTimer);
  $.ajax({
    type: "GET",
    url: "/result",
    success: function(response) {
      clearAll();
      displayValue(response);
      $(".display-bar").data("result", response);
      console.log("result:", response);
    }
  });
}

// when clear button is clicked, call clearAll
function checkForClear() {
  $("#clear").on("click", function() {
    console.log("clear");
    clearAll();
  });
}
