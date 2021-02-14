var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var fuelSum = 0

lineReader.on('line', function (line) {
  fuelSum += Math.floor(parseInt(line, 10) / 3) - 2
})

lineReader.on('close', function () {
  console.log(fuelSum)
})
