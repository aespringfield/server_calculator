// run functions on ready
$(document).ready(function() {
  listenForClicks();
});


// event handlers
function listenForClicks() {
  setOperator();
  clearResult();
  startCalculation();
}

// attach operator to a data value in equals div when clicked
function setOperator() {
  $(".operator").on("click", function() {
    var operator = $(this).data("operator");
    console.log(operator);
    $("#equals").data("currentOperator", operator);
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
    // change below to grab from form?
    var x = retrieveInput("value1");
    var y = retrieveInput("value2");
    var type = $(this).data("currentOperator");
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
      displayResult(response);
    }
  });
}

// change result-text to new result
function displayResult(response) {
  if (isNaN(response)) {
    response = "ERROR: input must be number values";
  }
  $(".result-text").text(response);
}
