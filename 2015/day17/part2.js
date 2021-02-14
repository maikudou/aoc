var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let containers = []

lineReader.on('line', function (line) {
  containers.push(parseInt(line, 10))
})

lineReader.on('close', function () {
  var liters = 150
  var spares = {}
  var minimumCount = containers.length

  for (var i = 0; i < Math.pow(2, containers.length); i++) {
    var sum = 0
    var binary = i.toString(2)
    var difference = containers.length - binary.length
    var count = 0
    for (var k = 0; k < difference; k++) {
      binary = String('0') + String(binary)
    }
    for (var j = 0; j < binary.length; j++) {
      if (Number(binary[j]) === 1) {
        count++
        sum += parseInt(containers[j], 10)
      }
      if (sum > liters) {
        break
      }
    }
    if (sum === liters) {
      if (spares[count]) {
        spares[count]++
      } else {
        spares[count] = 1
      }
      if (count < minimumCount) {
        minimumCount = count
      }
    }
  }

  console.log(spares[minimumCount])
})
