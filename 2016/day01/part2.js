var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let instructions = []

lineReader.on('line', function (line) {
  instructions = line.split(', ')
})

lineReader.on('close', function () {
  var x = 0
  var y = 0

  // input = "R8, R4, R4, R8";

  var vectorX = 0
  var vectorY = 1
  var prevVectorY
  var prevVectorX

  var coordsHash = {}
  var coordsAsString

  var instrictionTurn
  var instrictionLength
  var cross = false

  for (var i = 0; i < instructions.length; i++) {
    instrictionTurn = instructions[i][0]
    instrictionLength = Number(instructions[i].substr(1))

    prevVectorY = vectorY
    prevVectorX = vectorX

    if (instrictionTurn === 'R') {
      vectorY = vectorY ? 0 : -prevVectorX
      vectorX = vectorX ? 0 : prevVectorY
    } else {
      vectorY = vectorY ? 0 : prevVectorX
      vectorX = vectorX ? 0 : -prevVectorY
    }

    for (var j = 1; j <= instrictionLength; j++) {
      if (vectorX) {
        x += vectorX
      } else {
        y += vectorY
      }

      coordsAsString = String(x) + String(y)
      if (coordsHash[coordsAsString]) {
        cross = true
        break
      }
      coordsHash[coordsAsString] = true
    }
    if (cross) {
      break
    }
  }

  var distance = Math.abs(x) + Math.abs(y)

  console.log(distance)
})
