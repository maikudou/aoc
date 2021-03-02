var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let cityMap

lineReader.on('line', function (line) {
  cityMap = line
})

lineReader.on('close', function () {
  var xSanta = 0
  var ySanta = 0
  var xRobo = 0
  var yRobo = 0

  var turn = true

  var houses = { '0|0': 1 }

  for (var i = 0; i < cityMap.length; i++) {
    switch (cityMap[i]) {
      case '^':
        if (turn) {
          ySanta++
        } else {
          yRobo++
        }
        break
      case 'v':
        if (turn) {
          ySanta--
        } else {
          yRobo--
        }
        break
      case '>':
        if (turn) {
          xSanta++
        } else {
          xRobo++
        }
        break
      case '<':
        if (turn) {
          xSanta--
        } else {
          xRobo--
        }
        break
    }
    var houseName
    if (turn) {
      houseName = xSanta + '|' + ySanta
    } else {
      houseName = xRobo + '|' + yRobo
    }

    if (houses[houseName]) {
      houses[houseName]++
    } else {
      houses[houseName] = 1
    }

    turn = !turn
  }

  console.log(Object.keys(houses).length)
})
