const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const cubes = []

lineReader.on('line', function (line) {
  const [x, y, z] = /(\d+),(\d+),(\d+)/.exec(line).slice(1).map(toDecimal)
  cubes.push([x, y, z])
})

lineReader.on('close', function () {
  const totalSides = 6 * cubes.length
  let connectedSides = 0
  for (let i = 0; i < cubes.length; i++) {
    for (let j = 0; j < cubes.length; j++) {
      if (j !== i) {
        if (
          (cubes[i][0] === cubes[j][0] &&
            cubes[i][1] === cubes[j][1] &&
            Math.abs(cubes[i][2] - cubes[j][2]) === 1) ||
          (cubes[i][1] === cubes[j][1] &&
            cubes[i][2] === cubes[j][2] &&
            Math.abs(cubes[i][0] - cubes[j][0]) === 1) ||
          (cubes[i][0] === cubes[j][0] &&
            cubes[i][2] === cubes[j][2] &&
            Math.abs(cubes[i][1] - cubes[j][1]) === 1)
        ) {
          connectedSides++
        }
      }
    }
  }
  console.log(totalSides - connectedSides)
})
