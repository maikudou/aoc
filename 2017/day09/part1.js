var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var score = 0
var scoreSum = 0
var garbage = false
var char
var ignore = false

lineReader.on('line', function (line) {
  for (var i = 0; i < line.length; i++) {
    char = line[i]

    if (ignore) {
      ignore = false
      continue
    }

    if (char == '!') {
      ignore = true
      continue
    } else {
      ignore = false
    }

    switch (char) {
      case '{':
        if (!garbage) {
          score++
          scoreSum += score
        }
        break
      case '}':
        if (!garbage) {
          score--
        }
        break
      case '<':
        garbage = true
        break
      case '>':
        garbage = false
        break
      default:
        break
    }
  }
})

lineReader.on('close', function () {
  console.log(scoreSum)
})
