var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let input

lineReader.on('line', function (line) {
  input = line
})

lineReader.on('close', function () {
  function santaFloor(input) {
    var floor = 0
    var index = -1
    for (var i = 0; i < input.length; i++) {
      if (input[i] === '(') {
        floor++
      } else {
        floor--
      }
      if (floor === -1 && index < 0) {
        index = i + 1
      }
    }
    console.log(floor)
  }

  santaFloor(input)
})
