var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let containers = []

lineReader.on('line', function (line) {
  containers.push(parseInt(line, 10))
})

lineReader.on('close', function () {
  var liters = 150
  var variants = 0

  for (var i = 0; i < Math.pow(2, containers.length); i++) {
    var sum = 0
    var binary = i.toString(2)
    var difference = containers.length - binary.length
    for (var k = 0; k < difference; k++) {
      binary = String('0') + String(binary)
    }
    for (var j = 0; j < binary.length; j++) {
      if (Number(binary[j]) === 1) {
        sum += parseInt(containers[j], 10)
      }
      if (sum > liters) {
        break
      }
    }
    if (sum === liters) {
      variants++
    }
  }

  console.log(variants)
})
