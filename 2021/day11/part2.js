const toDecimal = require('../../utils/toDecimal')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const octopi = []

lineReader.on('line', function (line) {
  octopi.push(
    line
      .split('')
      .map(toDecimal)
      .map(level => ({ level, flashed: false }))
  )
})

let flashes = 0
function flashNeighbours(x, y) {
  ;[-1, 0, 1].forEach(y1 =>
    [-1, 0, 1].forEach(x1 => {
      if (x1 || y1) {
        if (octopi[y + y1] && octopi[y + y1][x + x1]) {
          const neighboutOctopus = octopi[y + y1][x + x1]
          if (!neighboutOctopus.flashed) {
            neighboutOctopus.level++
            if (neighboutOctopus.level > 9) {
              neighboutOctopus.level = 0
              neighboutOctopus.flashed = true
              flashes++
              flashNeighbours(x + x1, y + y1)
            }
          }
        }
      }
    })
  )
}

lineReader.on('close', function () {
  // console.log(octopi.map(row => row.map(v => v.level).join('')).join('\n'), '\n')
  for (let i = 0; i < 100000; i++) {
    flashes = 0
    octopi.forEach(row =>
      row.forEach(octopus => {
        octopus.level++
        octopus.flashed = false
      })
    )
    octopi.forEach((row, rowIndex) =>
      row.forEach((octopus, octopusIndex) => {
        if (octopus.level > 9 && !octopus.flashed) {
          octopus.level = 0
          octopus.flashed = true
          flashes++
          flashNeighbours(octopusIndex, rowIndex)
        }
      })
    )
    if (flashes === 100) {
      console.log(i + 1)
      break
    }
  }
  // console.log(octopi.map(row => row.map(v => v.level).join('')).join('\n'), '\n')
  // console.log(flashes)
})
