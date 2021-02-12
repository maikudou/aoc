var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/test')
})

const grid = new Map()
let maxX = 0

lineReader.on('line', function (line) {
  const match = /^\/dev\/grid\/node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T.+$/.exec(line)
  if (match) {
    const [_, x, y, size, used, available] = match
    grid.set(`${x}|${y}`, {
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      size: parseInt(size, 10),
      used: parseInt(used, 10),
      available: parseInt(available, 10)
    })
    maxX = Math.max(maxX, x)
  }
})

lineReader.on('close', function () {
  const gridArray = Array.from(grid.values())

  console.log(maxX)
})
