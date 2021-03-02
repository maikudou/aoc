var input = '1113122113'

for (var j = 0; j < 50; j++) {
  input = lookAndSay(input)
}

console.log(input.length)

function lookAndSay(input) {
  var output = []
  var prevDigit = null
  var nextDigit
  for (var i = 0; i < input.length; i++) {
    nextDigit = input[i]
    if (prevDigit === nextDigit) {
      output[output.length - 1].count++
    } else {
      output.push({ count: 1, digit: nextDigit })
    }
    prevDigit = input[i]
  }
  var outputString = ''
  for (var i = 0; i < output.length; i++) {
    outputString += output[i].count + output[i].digit
  }
  return outputString
}
