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

  var vectorX = 0
  var vectorY = 1
  var prevVectorY
  var prevVectorX

  var instrictionTurn
  var instrictionLength

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

    x += vectorX * instrictionLength
    y += vectorY * instrictionLength
  }

  var distance = Math.abs(x) + Math.abs(y)

  console.log(distance)
})
