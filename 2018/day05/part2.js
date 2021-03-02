var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})
var input

lineReader.on('line', function (line) {
  input = line
})

lineReader.on('close', function () {
  var shortest = Infinity
  var letters = 'qwertyuiopasdfghjklzxcvbnm'

  for (var l = 0; l < letters.length; l++) {
    const result = []
    for (var i = 0; i < input.length; i++) {
      if (
        result.length &&
        result[result.length - 1] != input[i] &&
        (result[result.length - 1].toUpperCase() == input[i] ||
          result[result.length - 1].toLowerCase() == input[i])
      ) {
        result.pop()
      } else if (input[i] != letters[l] && input[i].toLowerCase() != letters[l]) {
        result.push(input[i])
      }
      // console.log(result, input[i]);
    }
    shortest = Math.min(shortest, result.length)
  }

  console.log(shortest)
})
