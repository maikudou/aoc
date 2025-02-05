const { Heap } = require('../../utils/Heap')
const toDecimal = require('../../utils/toDecimal')

class MinHeap extends Heap {
  _compare(a, b) {
    return a.distTo < b.distTo
  }
}

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let startPosition = null
let endPosition = null
const walls = new Set()
const maxCheatsTicks = 2

let lineCount = 0
let width = 0

lineReader.on('line', function (line) {
  if (width === 0) {
    width = line.length
  }
  line.split('').forEach((cell, index) => {
    const pos = `${index}|${lineCount}`
    if (cell === '#') {
      walls.add(pos)
    } else if (cell === 'E') {
      endPosition = pos
    } else if (cell === 'S') {
      startPosition = pos
    }
  })
  lineCount++
})

function dijkstra() {
  const map = new Map()

  const [startX, startY] = startPosition.split('|').map(toDecimal)
  const [endX, endY] = endPosition.split('|').map(toDecimal)

  let current = {
    distTo: 0,
    x: startX,
    y: startY
  }
  map.set(`${current.x}|${current.y}`, 0)
  const visited = new Set()

  let heap = new MinHeap()
  let iterations = 0

  while (current) {
    if (visited.has(`${current.x}|${current.y}`)) {
      current = heap.pop()
      continue
    }

    const candidates = []

    if (!walls.has(`${current.x + 1}|${current.y}`)) {
      candidates.push({ x: current.x + 1, y: current.y })
    }

    if (!walls.has(`${current.x}|${current.y - 1}`)) {
      candidates.push({ x: current.x, y: current.y - 1 })
    }

    if (!walls.has(`${current.x - 1}|${current.y}`)) {
      candidates.push({ x: current.x - 1, y: current.y })
    }

    if (!walls.has(`${current.x}|${current.y + 1}`)) {
      candidates.push({ x: current.x, y: current.y + 1 })
    }

    candidates.forEach(candidate => {
      const id = `${candidate.x}|${candidate.y}`
      if (!visited.has(id)) {
        if (!map.has(id)) {
          map.set(id, current.distTo + 1)
        }
        heap.insert({
          distTo: Math.min(map.get(id), current.distTo + 1),
          x: candidate.x,
          y: candidate.y
        })
      }
    })

    visited.add(`${current.x}|${current.y}`)

    if (current.x == endX && current.y == endY) {
      return [current.distTo, map]
    }
    current = heap.pop()
  }
}

function countCheats(maxCheatsTicks = 2) {
  const [fairScore, map] = dijkstra(walls)

  let count = 0
  const min = 100

  // For each non-wall position we need to find another non-wall position
  // which is reachable within cheat limit and saves time
  // (aka start distance + amount of cheat moves < cheat's end position distance)
  // Count is sum of unique start-end pairs
  // Any non-direct route would not be time-saving so we only consider manhattan distance
  // between start and end position equal or less than maximum cheat time count
  for (let i = 1; i < width - 1; i++) {
    for (let j = 1; j < lineCount - 1; j++) {
      const id = `${i}|${j}`
      const startDist = map.get(id)

      if (!walls.has(id)) {
        for (let dX = -maxCheatsTicks; dX <= maxCheatsTicks; dX++) {
          for (
            let dY = -(maxCheatsTicks - Math.abs(dX));
            dY <= maxCheatsTicks - Math.abs(dX);
            dY++
          ) {
            if (dX !== 0 || dY !== 0) {
              const endId = `${i + dX}|${j + dY}`
              if (
                map.get(endId) &&
                !walls.has(id) &&
                map.get(endId) - (startDist + Math.abs(dX) + Math.abs(dY)) >= min
              ) {
                count++
              }
            }
          }
        }
      }
    }
  }
  return count
}

lineReader.on('close', function () {
  console.log(countCheats(2))
  console.log(countCheats(20))
})
