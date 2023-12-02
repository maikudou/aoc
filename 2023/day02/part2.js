var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let sum = 0

lineReader.on('line', function (line) {
  const [_, gameId, game] = /^Game (\d+): (.+)/g.exec(line)
  const sets = game.split('; ')
  const minCubes = sets.reduce(
    (acc, set) => {
      const cubes = set.split(', ')
      cubes.forEach(cube => {
        const [_, count, color] = /(\d+) (red|green|blue)/g.exec(cube)
        acc[color] = Math.max(acc[color], parseInt(count, 10))
      })
      return acc
    },
    { red: 0, green: 0, blue: 0 }
  )
  sum += minCubes.red * minCubes.green * minCubes.blue
})

lineReader.on('close', function () {
  console.log(sum)
})
