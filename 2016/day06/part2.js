var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const positionsArray = [
  new Map(),
  new Map(),
  new Map(),
  new Map(),
  new Map(),
  new Map(),
  new Map(),
  new Map()
]

lineReader.on('line', function (line) {
  for (var i = 0; i < 8; i++) {
    if (positionsArray[i].has(line[i])) {
      positionsArray[i].set(line[i], positionsArray[i].get(line[i]) + 1)
    } else {
      positionsArray[i].set(line[i], 1)
    }
  }
})

lineReader.on('close', function () {
  const positionMins = [
    Infinity,
    Infinity,
    Infinity,
    Infinity,
    Infinity,
    Infinity,
    Infinity,
    Infinity
  ]
  const password = []
  for (var position in positionsArray) {
    for (var value of Array.from(positionsArray[position])) {
      if (value[1] < positionMins[position]) {
        password[position] = value[0]
        positionMins[position] = value[1]
      }
    }
  }

  console.log(password.join(''))
})
