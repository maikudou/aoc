const { parseArgs } = require('util')
const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let lineNum = 0
const elves = new Set()

lineReader.on('line', function (line) {
  line.split('').forEach((v, i) => {
    if (v === '#') {
      elves.add(`${i}|${lineNum}`)
    }
  })
  lineNum++
})

lineReader.on('close', function () {
  let nextMoves = new Map()
  let dirs = ['N', 'S', 'W', 'E']

  // render()
  let iteration = 0

  while (true) {
    nextMoves = new Map()
    for (elf of elves) {
      let [x, y] = elf.split('|').map(toDecimal)
      let move = false
      if (
        !elves.has(`${x - 1}|${y - 1}`) &&
        !elves.has(`${x}|${y - 1}`) &&
        !elves.has(`${x + 1}|${y - 1}`) &&
        !elves.has(`${x - 1}|${y}`) &&
        !elves.has(`${x + 1}|${y}`) &&
        !elves.has(`${x - 1}|${y + 1}`) &&
        !elves.has(`${x}|${y + 1}`) &&
        !elves.has(`${x + 1}|${y + 1}`)
      ) {
        continue
      }
      for (dir of dirs) {
        switch (dir) {
          case 'N':
            if (
              !elves.has(`${x}|${y - 1}`) &&
              !elves.has(`${x - 1}|${y - 1}`) &&
              !elves.has(`${x + 1}|${y - 1}`)
            ) {
              move = true
              y--
            }
            break
          case 'S':
            if (
              !elves.has(`${x}|${y + 1}`) &&
              !elves.has(`${x - 1}|${y + 1}`) &&
              !elves.has(`${x + 1}|${y + 1}`)
            ) {
              move = true
              y++
            }
            break
          case 'W':
            if (
              !elves.has(`${x - 1}|${y}`) &&
              !elves.has(`${x - 1}|${y + 1}`) &&
              !elves.has(`${x - 1}|${y - 1}`)
            ) {
              move = true
              x--
            }
            break
          case 'E':
            if (
              !elves.has(`${x + 1}|${y}`) &&
              !elves.has(`${x + 1}|${y + 1}`) &&
              !elves.has(`${x + 1}|${y - 1}`)
            ) {
              move = true
              x++
            }
            break
        }
        if (move) {
          break
        }
      }
      if (move) {
        const movingElves = nextMoves.get(`${x}|${y}`) || []
        movingElves.push(elf)
        nextMoves.set(`${x}|${y}`, movingElves)
      }
    }
    dirs.push(dirs.shift())
    // console.log(nextMoves)
    Array.from(nextMoves.entries())
      .filter(([_, elves]) => elves.length === 1)
      .forEach(([to, from]) => {
        elves.delete(from[0])
        elves.add(to)
      })
    // console.log(`After round ${i + 1}`)
    // render()
    iteration++
    if (iteration == 10) {
      const [minX, maxX, minY, maxY] = getBounds()
      console.log('Part 1:', (maxY - minY + 1) * (maxX - minX + 1) - elves.size)
    }
    if (nextMoves.size == 0) {
      console.log('Part 2:', iteration)
      break
    }
  }
})

function getBounds() {
  return Array.from(elves.values())
    .map(e => e.split('|').map(toDecimal))
    .reduce(
      (acc, [x, y]) => [
        Math.min(acc[0], x),
        Math.max(acc[1], x),
        Math.min(acc[2], y),
        Math.max(acc[3], y)
      ],
      [Infinity, 0, Infinity, 0]
    )
}

function render() {
  const [minX, maxX, minY, maxY] = getBounds()
  console.log(minX, minY)
  for (let i = minY; i <= maxY; i++) {
    for (let j = minX; j <= maxX; j++) {
      process.stdout.write(elves.has(`${j}|${i}`) ? '#' : '.')
    }
    process.stdout.write('\n')
  }
}
