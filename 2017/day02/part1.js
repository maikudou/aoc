var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var largest = 0
var lowest = Infinity
var sum = 0
var lineArray
var current

lineReader.on('line', function (line) {
  lineArray = line.split(/\s+/)
  largest = 0
  lowest = Infinity
  for (var i = 0; i < lineArray.length; i++) {
    current = parseInt(lineArray[i])
    if (current > largest) {
      largest = current
    }
    if (current < lowest) {
      lowest = current
    }
  }
  sum += largest - lowest
})

lineReader.on('close', function () {
  console.log(sum)
})
