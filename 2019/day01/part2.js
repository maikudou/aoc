var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var fuelSum = 0

lineReader.on('line', function (line) {
  var fuel = Math.floor(parseInt(line, 10) / 3) - 2
  fuelSum += fuel
  while (fuel > 0) {
    fuel = Math.floor(parseInt(fuel, 10) / 3) - 2
    if (fuel > 0) {
      fuelSum += fuel
    }
  }
})

lineReader.on('close', function () {
  console.log(fuelSum)
})
