var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var score = 0
var garbage = false
var char
var ignore = false
var garbageChars = 0

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
        if (garbage) {
          garbageChars++
        }
        break
      case '}':
        if (!garbage) {
          score--
        } else {
          garbageChars++
        }
        break
      case '<':
        if (garbage) {
          garbageChars++
        }
        garbage = true
        break
      case '>':
        garbage = false
        break
      default:
        if (garbage) {
          garbageChars++
        }
    }
  }
})

lineReader.on('close', function () {
  console.log(garbageChars)
})
