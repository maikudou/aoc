const { createCanvas } = require('canvas')
const { writeFileSync } = require('fs')
const { join } = require('path')

const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const width = 101
const height = 103
const time = 100
const robots = []

lineReader.on('line', function (line) {
  const [_, x, y, vx, vy] = /p=(\d+),(\d+) v=(\-?\d+),(\-?\d+)/.exec(line)
  const f = toDecimal()
  robots.push({ x: toDecimal(x), y: toDecimal(y), vx: toDecimal(vx), vy: toDecimal(vy) })
})

const positions = new Map()

function render(second) {
  const multiplier = 4

  var canvas = createCanvas(width * multiplier, height * multiplier)
  var ctx = canvas.getContext('2d')
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, width * multiplier, height * multiplier)
  ctx.fillStyle = 'green'
  ctx.font = `regular 16px monospace`
  ctx.fillText(second, 2 * multiplier, 4 * multiplier)

  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      if (positions.has(`${j}|${i}`)) {
        ctx.fillRect(multiplier * j, multiplier * i, multiplier, multiplier)
      }
    }
  }

  var out = join(__dirname, 'render', 'tree.png')
  writeFileSync(out, canvas.toBuffer())
}

lineReader.on('close', function () {
  positions.clear()
  robots.forEach(robot => {
    const offX = robot.x + robot.vx * 7083
    const offY = robot.y + robot.vy * 7083
    const x = offX > 0 ? offX % width : offX % width === 0 ? 0 : width + (offX % width)
    const y = offY > 0 ? offY % height : offY % height === 0 ? 0 : height + (offY % height)
    positions.set(`${x}|${y}`, (positions.get(`${x}|${y}`) || 0) + 1)
  })
  render(7083)
})
