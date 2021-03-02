var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const input = []

lineReader.on('line', function (line) {
  input.push(line)
})

lineReader.on('close', function () {
  var current = 4
  var digits = []
  var line

  for (var i = 0; i < input.length; i++) {
    line = input[i]
    for (var j = 0; j < line.length; j++) {
      switch (line[j]) {
        case 'L':
          if (current % 3) {
            current--
          }
          break
        case 'R':
          if ((current - 2) % 3) {
            current++
          }
          break
        case 'U':
          if (current > 2) {
            current -= 3
          }
          break
        case 'D':
          if (current < 6) {
            current += 3
          }
          break
      }
    }
    digits.push(current + 1)
  }

  console.log(digits.join(''))
})
