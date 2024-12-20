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

let lineCount = 0

lineReader.on('line', function (line) {
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
    y: startY,
    facing: '>'
  }
  const visited = new Set()

  let heap = new MinHeap()
  let iterations = 0
  while (current) {
    if (visited.has(`${current.x}|${current.y}|${current.facing}`)) {
      current = heap.pop()
      continue
    }

    const candidates = []

    const rotating = {
      x: current.x,
      y: current.y,
      cost: 1000
    }

    if (current.facing === '>') {
      if (!walls.has(`${current.x + 1}|${current.y}`)) {
        candidates.push({ x: current.x + 1, y: current.y, cost: 1, facing: current.facing })
      }
      candidates.push({ ...rotating, facing: '^' })
      candidates.push({ ...rotating, facing: 'v' })
    } else if (current.facing === '^') {
      if (!walls.has(`${current.x}|${current.y - 1}`)) {
        candidates.push({ x: current.x, y: current.y - 1, cost: 1, facing: current.facing })
      }
      candidates.push({ ...rotating, facing: '<' })
      candidates.push({ ...rotating, facing: '>' })
    } else if (current.facing === '<') {
      if (!walls.has(`${current.x - 1}|${current.y}`)) {
        candidates.push({ x: current.x - 1, y: current.y, cost: 1, facing: current.facing })
      }
      candidates.push({ ...rotating, facing: '^' })
      candidates.push({ ...rotating, facing: 'v' })
    } else if (current.facing === 'v') {
      if (!walls.has(`${current.x}|${current.y + 1}`)) {
        candidates.push({ x: current.x, y: current.y + 1, cost: 1, facing: current.facing })
      }
      candidates.push({ ...rotating, facing: '<' })
      candidates.push({ ...rotating, facing: '>' })
    }

    candidates.forEach(candidate => {
      const id = `${candidate.x}|${candidate.y}|${candidate.facing}`
      if (!visited.has(id)) {
        if (!map.has(id)) {
          map.set(id, current.distTo + candidate.cost)
        }
        heap.insert({
          distTo: Math.min(map.get(id), current.distTo + candidate.cost),
          x: candidate.x,
          y: candidate.y,
          facing: candidate.facing
        })
      }
    })

    visited.add(`${current.x}|${current.y}|${current.facing}`)

    if (current.x == endX && current.y == endY) {
      return current.distTo
    }
    current = heap.pop()
  }
}

lineReader.on('close', function () {
  console.log(dijkstra())
})
