var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const max = {
  blue: 14,
  green: 13,
  red: 12
}

let sum = 0

lineReader.on('line', function (line) {
  const [_, gameId, game] = /^Game (\d+): (.+)/g.exec(line)
  const sets = game.split('; ')
  const badGame = sets.find(set => {
    const cubes = set.split(', ')
    const badCube = cubes.find(cube => {
      const [_, count, color] = /(\d+) (red|green|blue)/g.exec(cube)
      if (count > max[color]) {
        return true
      } else {
        return false
      }
    })
    return !!badCube
  })
  if (!badGame) {
    sum += parseInt(gameId, 10)
  }
})

lineReader.on('close', function () {
  console.log(sum)
})
