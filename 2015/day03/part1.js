var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let cityMap

lineReader.on('line', function (line) {
  cityMap = line
})

lineReader.on('close', function () {
  var x = 0
  var y = 0

  var houses = { '0|0': 1 }

  for (var i = 0; i < cityMap.length; i++) {
    switch (cityMap[i]) {
      case '^':
        y++
        break
      case 'v':
        y--
        break
      case '>':
        x++
        break
      case '<':
        x--
        break
    }

    var houseName = x + '|' + y

    if (houses[houseName]) {
      houses[houseName]++
    } else {
      houses[houseName] = 1
    }
  }

  console.log(Object.keys(houses).length)
})
