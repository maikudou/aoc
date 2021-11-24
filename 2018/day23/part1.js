const manhattanDistance = require('../../utils/manhattanDistance')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const bots = []

lineReader.on('line', function (line) {
  const [_, x, y, z, r] = /pos=<(\-?\d+),(\-?\d+),(\-?\d+)>, r=(\d+)/.exec(line)
  bots.push({ x: parseInt(x, 10), y: parseInt(y, 10), z: parseInt(z, 10), r: parseInt(r, 10) })
})

lineReader.on('close', function () {
  const maxRadiusBot = bots.reduce(
    (acc, value) => {
      if (acc.r > value.r) {
        return acc
      } else {
        return value
      }
    },
    { r: 0 }
  )
  const inRadius = bots.reduce((acc, value) => {
    return acc + (manhattanDistance(maxRadiusBot, value) <= maxRadiusBot.r ? 1 : 0)
  }, 0)
  console.log(inRadius)
})
