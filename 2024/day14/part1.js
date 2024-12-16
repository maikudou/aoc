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

lineReader.on('close', function () {
  robots.forEach(robot => {
    const offX = robot.x + robot.vx * 100
    const offY = robot.y + robot.vy * 100
    const x = offX > 0 ? offX % width : offX % width === 0 ? 0 : width + (offX % width)
    const y = offY > 0 ? offY % height : offY % height === 0 ? 0 : height + (offY % height)
    positions.set(`${x}|${y}`, (positions.get(`${x}|${y}`) || 0) + 1)
  })

  let q1 = 0
  let q2 = 0
  let q3 = 0
  let q4 = 0
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      if (positions.has(`${j}|${i}`)) {
        if (j > width / 2) {
          if (i < height / 2 - 1) {
            q1 += positions.get(`${j}|${i}`)
          } else if (i > height / 2) {
            q4 += positions.get(`${j}|${i}`)
          }
        } else if (j < width / 2 - 1) {
          if (i < height / 2 - 1) {
            q2 += positions.get(`${j}|${i}`)
          } else if (i > height / 2) {
            q3 += positions.get(`${j}|${i}`)
          }
        }
      }
    }
  }
  console.log(q1 * q2 * q3 * q4)
})
