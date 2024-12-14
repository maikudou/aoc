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
      const visited = new Set()
      while (typeof currentCheck !== 'undefined') {
        if (visited.has(currentCheck)) {
          currentCheck = toCheck.shift()
          continue
        }
        visited.add(currentCheck)
        const currentHeight = map[currentCheck]

        if (currentHeight === 9) {
          score++
        } else {
          if (
            currentCheck >= width &&
            map[currentCheck - width] === currentHeight + 1 &&
            !visited.has(currentCheck - width)
          ) {
            toCheck.push(currentCheck - width)
          }
          if (
            map[currentCheck + width] === currentHeight + 1 &&
            !visited.has(currentCheck + width)
          ) {
            toCheck.push(currentCheck + width)
          }
          if (
            currentCheck % width &&
            map[currentCheck - 1] === currentHeight + 1 &&
            !visited.has(currentCheck - 1)
          ) {
            toCheck.push(currentCheck - 1)
          }
          if (
            (currentCheck + 1) % width &&
            map[currentCheck + 1] === currentHeight + 1 &&
            !visited.has(currentCheck + 1)
          ) {
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
