const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const map = new Map()
let absoluteMaxY = 0

lineReader.on('line', function (line) {
  line.split(' -> ').reduce((prev, line) => {
    const [x, y] = line.split(',').map(toDecimal)
    absoluteMaxY = Math.max(absoluteMaxY, y)
    if (prev !== null) {
      const minX = Math.min(prev.x, x)
      const minY = Math.min(prev.y, y)
      const maxX = minX + Math.abs(prev.x - x)
      const maxY = minY + Math.abs(prev.y - y)
      for (let i = minX; i <= maxX; i++) {
        map.set(`${i}|${minY}`, '#')
      }
      for (let i = minY; i <= maxY; i++) {
        map.set(`${minX}|${i}`, '#')
      }
    }
    return { x, y }
  }, null)
})

let units = 0

lineReader.on('close', function () {
  const floorY = 2 + absoluteMaxY
  let x = 500
  let y = 0
  while (true) {
    if (y < floorY - 1 && !map.has(`${x}|${y + 1}`)) {
      y++
    } else if (y < floorY - 1 && !map.has(`${x - 1}|${y + 1}`)) {
      y++
      x--
    } else if (y < floorY - 1 && !map.has(`${x + 1}|${y + 1}`)) {
      y++
      x++
    } else if (y === 0) {
      units++
      break
    } else if (y > 0) {
      map.set(`${x}|${y}`, 'o')
      units++
      x = 500
      y = 0
    }
  }
  console.log(units)
})
