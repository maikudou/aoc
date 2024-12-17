const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let lineCount = 0
let width = 0
const walls = new Set()
const boxes = new Set()
let moves = []
let robot = ''

let mode = 'map'

function render() {
  for (let i = 0; i < lineCount; i++) {
    for (let j = 0; j < width; j++) {
      const coords = `${j}|${i}`
      if (walls.has(coords)) {
        process.stdout.write('#')
      } else if (boxes.has(coords)) {
        process.stdout.write('O')
      } else if (robot === coords) {
        process.stdout.write('@')
      } else {
        process.stdout.write('.')
      }
    }
    process.stdout.write('\n')
  }
}

lineReader.on('line', function (line) {
  if (!line) {
    mode = moves
    return
  }
  if (mode === 'map') {
    width = line.length
    line.split('').forEach((cell, index) => {
      switch (cell) {
        case '#':
          walls.add(`${index}|${lineCount}`)
          break
        case '@':
          robot = `${index}|${lineCount}`
          break
        case 'O':
          boxes.add(`${index}|${lineCount}`)
          break
      }
    })
    lineCount++
  } else {
    moves = moves.concat(line.split(''))
  }
})

lineReader.on('close', function () {
  while (moves.length) {
    const nextMove = moves.shift()
    let [x, y] = robot.split('|').map(toDecimal)
    const rX = x
    const rY = y
    let dX = 0
    let dY = 0
    let canMove = true
    const boxesToMove = []
    switch (nextMove) {
      case '^':
        dY = -1
        break
      case '>':
        dX = 1
        break
      case 'v':
        dY = 1
        break
      case '<':
        dX = -1
        break
    }

    while (canMove) {
      y += dY
      x += dX
      if (walls.has(`${x}|${y}`)) {
        canMove = false
        break
      }
      if (boxes.has(`${x}|${y}`)) {
        boxesToMove.push(`${x}|${y}`)
      } else {
        break
      }
    }
    if (canMove) {
      robot = `${rX + dX}|${rY + dY}`
      boxesToMove
        .map(box => {
          boxes.delete(box)
          return box
        })
        .forEach(box => {
          const [bX, bY] = box.split('|').map(toDecimal)
          boxes.add(`${bX + dX}|${bY + dY}`)
        })
    }
  }
  console.log(
    Array.from(boxes.values()).reduce((acc, box) => {
      const [x, y] = box.split('|').map(toDecimal)
      return acc + y * 100 + x
    }, 0)
  )
})
