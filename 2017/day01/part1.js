var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let input

lineReader.on('line', function (line) {
  input = line
})

lineReader.on('close', function () {
  var sum = 0
  var length = input.length
  var current
  var next
  for (var i = 0; i < length; i++) {
    current = parseInt(input[i])
    next = parseInt(input[i == length - 1 ? 0 : i + 1])
    if (current == next) {
      sum += current
    }
  }
  console.log(sum)
})
