var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let input

lineReader.on('line', function (line) {
  input = line
})

lineReader.on('close', function () {
  var length = input.length
  var halfLength = length / 2
  sum = 0

  for (var i = 0; i < length; i++) {
    current = parseInt(input[i])
    if (i < halfLength) {
      next = parseInt(input[i + halfLength])
    } else {
      next = parseInt(input[i - halfLength])
    }
    if (current == next) {
      sum += current
    }
  }
  console.log(sum)
})
