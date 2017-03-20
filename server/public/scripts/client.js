// timer
var timer;

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

// when number button is clicked, adds digit to result bar and stores its value
function addDigit() {
  $(".number").on("click", function() {
    if ($(".result").data("result")) {
      $(".result").data("result", "");
    }
    var digit = $(this).data("value");
    concatInput(digit);
    var result = $(".result").data("value");
    console.log(result);
    displayResult(result);
  });
}

// attach operator to a data-type attribute in equals div when clicked
// take data-value from results bar and attach it to data-x in equals div
// clear results bar & data-value for results bar
function setOperator() {
  $(".operator").on("click", function() {
    clearOrContinue();
    var operator = $(this).data("operator");
    var result = $(this).data("result");
    if (!($(".result").data("value"))) {
      clearResult();
      console.log("setOperator clear");
      $(".result-text").text("ERROR: Cannot select operator before first input");
    } else if ($(".result").data("x")) {
      if (result) {
        console.log($(".result").data("x"),$(".result").data("y"));
        $(".result").data("x", result);
      } else {
        console.log($(".result").data("x"),$(".result").data("y"));
        storeOperand("y");
        makeCalculation();
        $(".result").data("type", operator);
      }
    } else {
      storeOperand("x");
      $(".result").data("type", operator);
    }
  });
}

// when clear div is clicked, empty old result-text
function checkForClear() {
  $("#clear").on("click", function() {
    clearResult();
  });
}

function clearResult() {
  console.log("clear");
  $(".result-text").empty();
  $(".result").data("result", "");
  $(".result").data("x", "");
  $(".result").data("y", "");
  $(".result").data("type", "");
}

// when equals div is clicked, create calculation object and send to server
// if there are not 2 valid inputs, returns false, clears input, and displays an error message
function makeCalculation() {
  console.log("calculating");
  var calcObject = createCalcObject();
  if (checkInput(calcObject.x, calcObject.y)) {
    console.log("x:", calcObject.x, "; y:", calcObject.y, "; type:", calcObject.type);
    postCalcObject(calcObject);
  } else {
    clearResult();
    console.log("makeCalculation clear");
    $(".result-text").text("ERROR: Must have 2 number inputs");
  }
}

function checkForEquals() {
  $("#equals").on("click", function() {
    storeOperand("y");
    makeCalculation();
  });
}

// create object to post to server with 2 inputs and operation type
function createCalcObject() {
  var $result = $(".result");
  var x = $result.data("x");
  var y = $result.data("y");
  var type = $result.data("type");
  var calcObject = new CalcObject(x, y, type);
  return calcObject;
}

// check 2 inputs to see if they both exist and are numbers
function checkInput(x, y) {
  if (isNaN(parseFloat(x)) || isNaN(parseFloat(y))) {
    return false;
  } else {
    return true;
  }
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
      timer = setInterval(retrieveResult, 3000);
      displayResult("CALCULATING...");
    }
  });
}

// use ajax get to retrieve calculated result from server
function retrieveResult() {
  clearInterval(timer);
  $.ajax({
    type: "GET",
    url: "/result",
    success: function(response) {
      displayResult(response);
      $(".result").data("result", response);
      console.log("result:", response);
    }
  });
}

// checks to see if a result has just been returned & stores it in a variable
// either clears all results or keeps result as first parameter
function clearOrContinue() {
  var result = $(".result").data("result");
  if (result) {
    clearResult();
    console.log("clearOrContinue clear");
    $(".result").data("value", result);
  // } else {
  //   var x = $(".result").data("x");
  //   var y = $(".result").data("y");
  //   if (checkInput(x, y)) {
  //     storeOperand("y");
  //     makeCalculation();
  //   }
  }
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
  var operand = $(".result").data("value");
  $(".result").data(attribute, operand);
  $(".result").data("value", "");
}
