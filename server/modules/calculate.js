// Takes in first operand (x), second operand (y), and type of operation (type).
// Returns calculated result as string
function calculate(x, y, type) {
  x = parseFloat(x);
  y = parseFloat(y);
  var result;
  switch (type) {
    case "add":
      result = x + y;
      break;
    case "subtract":
      result = x - y;
      break;
    case "multiply":
      result = x * y;
      break;
    case "divide":
      result = x / y;
      break;
  }
  return result.toString();
}

// Exports
module.exports = calculate;
