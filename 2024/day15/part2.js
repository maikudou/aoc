const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let lineCount = 0
let width = 0
const walls = new Set()
const boxes = new Map()
const boxIdToCoords = new Map()

let moves = []
let robot = ''

let mode = 'map'

function render() {
  for (let i = 0; i < lineCount; i++) {
    let hadBox = false
    for (let j = 0; j < width; j++) {
      const coords = `${j}|${i}`
      if (walls.has(coords)) {
        process.stdout.write('#')
      } else if (boxes.has(coords)) {
        if (hadBox) {
          process.stdout.write(']')
          hadBox = false
        } else {
          process.stdout.write('[')
          hadBox = true
        }
      } else if (robot === coords) {
        process.stdout.write('@')
      } else {
        process.stdout.write('.')
      }
    }
    process.stdout.write('\n')
  }
}

let boxId = 0
lineReader.on('line', function (line) {
  if (!line) {
    mode = moves
    return
  }
  if (mode === 'map') {
    width = line.length * 2
    index = 0
    line.split('').forEach(cell => {
      switch (cell) {
        case '#':
          walls.add(`${index}|${lineCount}`)
          walls.add(`${index + 1}|${lineCount}`)
          break
        case '@':
          robot = `${index}|${lineCount}`
          break
        case 'O':
          boxes.set(`${index}|${lineCount}`, boxId)
          boxes.set(`${index + 1}|${lineCount}`, boxId)
          boxIdToCoords.set(boxId, [`${index}|${lineCount}`, `${index + 1}|${lineCount}`])
          boxId++
          break
      }
      index += 2
    })
    lineCount++
  } else {
    moves = moves.concat(line.split(''))
  }
})

lineReader.on('close', function () {
  // render()
  while (moves.length) {
    const nextMove = moves.shift()
    let [x, y] = robot.split('|').map(toDecimal)
    const rX = x
    const rY = y
    let dX = 0
    let dY = 0
    let canMove = true
    const boxesToMove = new Set()
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
      if (nextMove === 'v' || nextMove === '^') {
        const xCoordsOfBoxes = new Set(
          Array.from(boxesToMove.values())
            .map(boxId => {
              const boxesWithId = boxIdToCoords.get(boxId) || []
              return boxesWithId
                .map(box => box.split('|').map(toDecimal))
                .filter(([bx, by]) => by === y - dY)
                .map(([bx]) => bx)
            })
            .flatMap(b => b)
        )
        if (xCoordsOfBoxes.size == 0) {
          xCoordsOfBoxes.add(x)
        }
        const xArray = Array.from(xCoordsOfBoxes)
        if (xArray.some(x => walls.has(`${x}|${y}`))) {
          canMove = false
          break
        }

        if (xArray.some(x => boxes.has(`${x}|${y}`))) {
          xArray.forEach(x => {
            if (boxes.has(`${x}|${y}`)) {
              boxesToMove.add(boxes.get(`${x}|${y}`))
            }
          })
        } else {
          break
        }
        if (Array.from(boxesToMove.values()).some(b => typeof b === 'undefined')) {
          console.log(boxesToMove, nextMove, xCoordsOfBoxes)
          process.exit(1)
        }
      } else {
        if (walls.has(`${x}|${y}`)) {
          canMove = false
          break
        }
        if (boxes.has(`${x}|${y}`)) {
          boxesToMove.add(boxes.get(`${x}|${y}`))
        } else {
          break
        }
      }
    }
    if (canMove) {
      robot = `${rX + dX}|${rY + dY}`
      Array.from(boxesToMove.values())
        .map(boxId => {
          const boxesWithId = boxIdToCoords.get(boxId) || []
          boxesWithId.forEach(box => {
            boxes.delete(box)
          })
          return boxId
        })
        .forEach(boxId => {
          const boxesWithId = boxIdToCoords.get(boxId) || []
          const coords = boxesWithId.map(box => {
            const [bX, bY] = box.split('|').map(toDecimal)
            return `${bX + dX}|${bY + dY}`
          })
          coords.forEach(coords => {
            boxes.set(coords, boxId)
          })
          if (typeof boxId === 'undefined') {
            console.log(boxesToMove, nextMove)
            process.exit(1)
          }
          boxIdToCoords.set(boxId, coords)
        })
    }
  }

  console.log(
    Array.from(boxIdToCoords.values()).reduce((acc, coords) => {
      const [x, y] = coords[0].split('|').map(toDecimal)
      return acc + y * 100 + x
    }, 0)
  )
})
