var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const postionsArray = [
  new Map(),
  new Map(),
  new Map(),
  new Map(),
  new Map(),
  new Map(),
  new Map(),
  new Map()
]
const positionsMaxes = []

lineReader.on('line', function (line) {
  for (var i = 0; i < 8; i++) {
    if (postionsArray[i].has(line[i])) {
      postionsArray[i].set(line[i], postionsArray[i].get(line[i]) + 1)
    } else {
      postionsArray[i].set(line[i], 1)
    }
    if (!positionsMaxes[i] || positionsMaxes[i].value < postionsArray[i].get(line[i])) {
      positionsMaxes[i] = {
        letter: line[i],
        value: postionsArray[i].get(line[i])
      }
    }
  }
})

lineReader.on('close', function () {
  console.log(positionsMaxes.map(value => value.letter).join(''))
})
