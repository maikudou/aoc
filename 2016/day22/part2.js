const { createCanvas } = require('canvas')
const { writeFileSync } = require('fs')
const { join } = require('path')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const grid = new Map()
let maxX = 0
let maxY = 0

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
    maxY = Math.max(maxY, y)
  }
})

lineReader.on('close', function () {
  const gridArray = Array.from(grid.values())
  console.log(maxX)

  const multiplier = 16

  var canvas = createCanvas((maxX + 1) * multiplier, (maxY + 1) * multiplier)
  var ctx = canvas.getContext('2d')
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, (maxX + 1) * multiplier, (maxY + 1) * multiplier)

  for (var y = 0; y <= maxY; y++) {
    for (var x = 0; x <= maxX; x++) {
      const currentCell = grid.get(`${x}|${y}`)
      ctx.fillStyle =
        x == 0 && y == 0
          ? 'green'
          : x == maxX && y == 0
          ? 'blue'
          : currentCell.used == 0
          ? 'black'
          : 'white'

      if (
        (grid.has(`${x - 1}|${y}`) && grid.get(`${x - 1}|${y}`).size < currentCell.used) ||
        (grid.has(`${x}|${y - 1}`) && grid.get(`${x}|${y - 1}`).size < currentCell.used) ||
        (grid.has(`${x + 1}|${y}`) && grid.get(`${x + 1}|${y}`).size < currentCell.used) ||
        (grid.has(`${x}|${y + 1}`) && grid.get(`${x}|${y + 1}`).size < currentCell.used)
      ) {
        ctx.fillStyle = 'red'
      }

      ctx.fillRect(x * multiplier + 1, y * multiplier + 1, multiplier - 2, multiplier - 2)
    }
  }

  var out = join(__dirname, 'render', `!start.png`)
  writeFileSync(out, canvas.toBuffer())

  // 62
})
