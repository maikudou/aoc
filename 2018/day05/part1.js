var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})
var input

lineReader.on('line', function (line) {
  input = line
})

lineReader.on('close', function () {
  const result = [input[0]]
  for (var i = 1; i < input.length; i++) {
    if (
      result.length &&
      result[result.length - 1] != input[i] &&
      (result[result.length - 1].toUpperCase() == input[i] ||
        result[result.length - 1].toLowerCase() == input[i])
    ) {
      result.pop()
    } else {
      result.push(input[i])
    }
  }

  console.log(result.length)
})
