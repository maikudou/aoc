const { createCanvas } = require('canvas')
const { writeFileSync } = require('fs')
const { join } = require('path')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const map = []
let startX
let startY
let maxDist = 0
let maxX = 0
let maxY = 0

const up = new Set(['|', 'F', '7'])
const down = new Set(['|', 'L', 'J'])
const right = new Set(['-', 'J', '7'])
const left = new Set(['-', 'F', 'L'])

function renderDists() {
  console.log(
    map
      .map(row => row.map(cell => (cell.visited ? cell.distance % 10 : cell.pipe)).join(''))
      .join('\n')
  )
}

const multiplier = 32

function renderCanvas() {
  var canvas = createCanvas(maxX * multiplier, maxY * multiplier)
  var ctx = canvas.getContext('2d')
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, (maxX + 1) * multiplier, (maxY + 1) * multiplier)

  for (var y = 0; y < maxY; y++) {
    for (var x = 0; x < maxX; x++) {
      const currentCell = map[y][x]
      ctx.fillStyle = 'white'
      ctx.strokeStyle = 'black'
      ctx.font = `regular ${multiplier / 4}px monospace`

      if (currentCell.visited) {
        if (currentCell.pipe === 'S') {
          ctx.fillStyle = 'green'
        } else if (currentCell.distance === maxDist) {
          ctx.fillStyle = 'red'
        } else {
          ctx.fillStyle = 'white'
        }
        ctx.fillRect(x * multiplier, y * multiplier, multiplier, multiplier)
        ctx.lineWidth = multiplier / 16
        ctx.strokeRect(x * multiplier, y * multiplier, multiplier, multiplier)
        ctx.fillStyle = 'black'
        ctx.fillText(
          currentCell.distance,
          x * multiplier + multiplier / 8,
          y * multiplier + multiplier / 4,
          multiplier
        )

        ctx.beginPath()
        switch (currentCell.pipe) {
          case 'J':
            ctx.arc(x * multiplier, y * multiplier, multiplier / 2, 0, 0.5 * Math.PI)
            break
          case 'F':
            ctx.arc(
              (x + 1) * multiplier,
              (y + 1) * multiplier,
              multiplier / 2,
              Math.PI,
              1.5 * Math.PI
            )
            break
          case '7':
            ctx.arc(
              x * multiplier,
              (y + 1) * multiplier,
              multiplier / 2,
              1.5 * Math.PI,
              2 * Math.PI
            )
            break
          case 'L':
            ctx.arc((x + 1) * multiplier, y * multiplier, multiplier / 2, 0.5 * Math.PI, Math.PI)
            break
          case '-':
            ctx.moveTo(x * multiplier, y * multiplier + multiplier / 2)
            ctx.lineTo((x + 1) * multiplier, y * multiplier + multiplier / 2)
            break
          case '|':
            ctx.moveTo(x * multiplier + multiplier / 2, y * multiplier)
            ctx.lineTo(x * multiplier + multiplier / 2, (y + 1) * multiplier)
            break
        }
        ctx.strokeStyle = 'blue'
        ctx.lineWidth = multiplier / 8
        ctx.stroke()
      } else {
        ctx.fillStyle = 'gray'
        ctx.fillRect(x * multiplier, y * multiplier, multiplier, multiplier)
        ctx.lineWidth = multiplier / 16
        ctx.strokeRect(x * multiplier, y * multiplier, multiplier, multiplier)
      }
    }
  }

  var out = join(__dirname, 'render', `map.png`)
  writeFileSync(out, canvas.toBuffer())
}

function traverse(tracer) {
  let moved = false
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (((x && !y) || (!x && y)) && !moved) {
        let nextMove = false
        switch (map[tracer.y][tracer.x].pipe) {
          case '|':
            if (y) {
              nextMove =
                !map[tracer.y + y][tracer.x + x].visited &&
                (y > 0 ? down : up).has(map[tracer.y + y][tracer.x + x].pipe)
            }
            break
          case '-':
            if (x) {
              nextMove =
                !map[tracer.y + y][tracer.x + x].visited &&
                (x > 0 ? right : left).has(map[tracer.y + y][tracer.x + x].pipe)
            }
            break
          case 'J':
            if (x == -1) {
              nextMove =
                !map[tracer.y + y][tracer.x + x].visited &&
                left.has(map[tracer.y + y][tracer.x + x].pipe)
            } else if (y == -1) {
              nextMove =
                !map[tracer.y + y][tracer.x + x].visited &&
                up.has(map[tracer.y + y][tracer.x + x].pipe)
            }
            break
          case 'F':
            if (x == 1) {
              nextMove =
                !map[tracer.y + y][tracer.x + x].visited &&
                right.has(map[tracer.y + y][tracer.x + x].pipe)
            } else if (y == 1) {
              nextMove =
                !map[tracer.y + y][tracer.x + x].visited &&
                down.has(map[tracer.y + y][tracer.x + x].pipe)
            }
            break
          case '7':
            if (x == -1) {
              nextMove =
                !map[tracer.y + y][tracer.x + x].visited &&
                left.has(map[tracer.y + y][tracer.x + x].pipe)
            } else if (y == 1) {
              nextMove =
                !map[tracer.y + y][tracer.x + x].visited &&
                down.has(map[tracer.y + y][tracer.x + x].pipe)
            }
            break
          case 'L':
            if (x == 1) {
              nextMove =
                !map[tracer.y + y][tracer.x + x].visited &&
                right.has(map[tracer.y + y][tracer.x + x].pipe)
            } else if (y == -1) {
              nextMove =
                !map[tracer.y + y][tracer.x + x].visited &&
                up.has(map[tracer.y + y][tracer.x + x].pipe)
            }
            break
          default:
            if (x == 1) {
              nextMove =
                !map[tracer.y + y][tracer.x + x].visited &&
                right.has(map[tracer.y + y][tracer.x + x].pipe)
            } else if (x == -1) {
              nextMove =
                !map[tracer.y + y][tracer.x + x].visited &&
                left.has(map[tracer.y + y][tracer.x + x].pipe)
            } else if (y == 1) {
              nextMove =
                !map[tracer.y + y][tracer.x + x].visited &&
                down.has(map[tracer.y + y][tracer.x + x].pipe)
            } else if (y == -1) {
              nextMove =
                !map[tracer.y + y][tracer.x + x].visited &&
                up.has(map[tracer.y + y][tracer.x + x].pipe)
            }
            break
        }
        if (nextMove) {
          moved = true
          map[tracer.y + y][tracer.x + x].visited = true
          map[tracer.y + y][tracer.x + x].distance = map[tracer.y][tracer.x].distance + 1
          maxDist = Math.max(maxDist, map[tracer.y + y][tracer.x + x].distance)
          tracer.x = tracer.x + x
          tracer.y = tracer.y + y
        }
      }
    }
  }
  return moved
}

lineReader.on('line', function (line) {
  const lineArray = line.split('').map(v => ({ pipe: v, visited: false, distance: null }))
  map.push(lineArray)
  const findX = lineArray.findIndex(v => v.pipe === 'S')
  if (findX > -1) {
    startX = findX
    startY = map.length - 1
  }
})

lineReader.on('close', function () {
  maxY = map.length
  maxX = map[0].length
  map[startY][startX].visited = true
  map[startY][startX].distance = 0

  let tracerA = { x: startX, y: startY }
  let tracerB = { x: startX, y: startY }
  while (traverse(tracerA) && traverse(tracerB)) {}
  console.log(maxDist)
  renderCanvas()
})
