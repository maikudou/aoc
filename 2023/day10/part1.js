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

const up = new Set(['|', 'F', '7'])
const down = new Set(['|', 'L', 'J'])
const right = new Set(['-', 'J', '7'])
const left = new Set(['-', 'F', 'L'])

function traverse(tracer, map) {
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
  map[startY][startX].visited = true
  map[startY][startX].distance = 0

  let tracerA = { x: startX, y: startY }
  let tracerB = { x: startX, y: startY }
  while (traverse(tracerA, map) && traverse(tracerB, map)) {}
  console.log(maxDist)
})
