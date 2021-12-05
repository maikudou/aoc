const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const lines = []

lineReader.on('line', function (line) {
  const [_, x, y, x2, y2] = /(\d+),(\d+) -> (\d+),(\d+)/.exec(line)
  lines.push({ x: toDecimal(x), y: toDecimal(y), x2: toDecimal(x2), y2: toDecimal(y2) })
})

lineReader.on('close', function () {
  let map = new Map()
  lines
    .filter(line => line.x == line.x2 || line.y == line.y2)
    .forEach(line => {
      if (line.y == line.y2) {
        for (let x = Math.min(line.x, line.x2); x <= Math.max(line.x, line.x2); x++) {
          map.set(`${x}|${line.y}`, (map.get(`${x}|${line.y}`) || 0) + 1)
        }
      } else {
        for (let y = Math.min(line.y, line.y2); y <= Math.max(line.y, line.y2); y++) {
          map.set(`${line.x}|${y}`, (map.get(`${line.x}|${y}`) || 0) + 1)
        }
      }
    })
  console.log(Array.from(map.values()).reduce((acc, value) => acc + (value > 1 ? 1 : 0), 0))
})
