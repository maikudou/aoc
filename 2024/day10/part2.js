const { north, south, west, east } = require('../../utils/mapNeigbors')
const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let map = []
let width = 0

lineReader.on('line', function (line) {
  width = line.length
  map = map.concat(line.split('').map(toDecimal))
})

lineReader.on('close', function () {
  let sum = 0

  map.forEach((height, index) => {
    if (height === 0) {
      let score = 0
      const toCheck = [index]
      let currentCheck = toCheck.shift()
      while (typeof currentCheck !== 'undefined') {
        const currentHeight = map[currentCheck]

        if (currentHeight === 9) {
          score++
        } else {
          if (north(map, width, currentCheck) === currentHeight + 1) {
            toCheck.push(currentCheck - width)
          }
          if (south(map, width, currentCheck) === currentHeight + 1) {
            toCheck.push(currentCheck + width)
          }
          if (west(map, width, currentCheck) === currentHeight + 1) {
            toCheck.push(currentCheck - 1)
          }
          if (east(map, width, currentCheck) === currentHeight + 1) {
            toCheck.push(currentCheck + 1)
          }
        }
        currentCheck = toCheck.shift()
      }
      sum += score
    }
  })
  console.log(sum)
})
