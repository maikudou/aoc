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

const size = 71
let limit = 1024

const corrupted = new Set()

lineReader.on('line', function (line) {
  limit--
  if (limit >= 0) {
    corrupted.add(line)
  }
})

function dijkstra() {
  const map = new Map()

  const startX = 0
  const startY = 0
  const endX = size - 1
  const endY = size - 1

  let current = {
    distTo: 0,
    x: startX,
    y: startY
  }
  const visited = new Set()

  let heap = new MinHeap()
  while (current) {
    if (visited.has(`${current.x},${current.y}`)) {
      current = heap.pop()
      continue
    }

    const candidates = []

    if (current.x < size - 1 && !corrupted.has(`${current.x + 1},${current.y}`)) {
      candidates.push({ x: current.x + 1, y: current.y })
    }
    if (current.y > 0 && !corrupted.has(`${current.x},${current.y - 1}`)) {
      candidates.push({ x: current.x, y: current.y - 1 })
    }

    if (current.x > 0 && !corrupted.has(`${current.x - 1},${current.y}`)) {
      candidates.push({ x: current.x - 1, y: current.y })
    }

    if (current.y < size - 1 && !corrupted.has(`${current.x},${current.y + 1}`)) {
      candidates.push({ x: current.x, y: current.y + 1 })
    }

    candidates.forEach(candidate => {
      const id = `${candidate.x},${candidate.y}`
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

    visited.add(`${current.x},${current.y}`)

    if (current.x == endX && current.y == endY) {
      return current.distTo
    }
    current = heap.pop()
  }
}

lineReader.on('close', function () {
  console.log(dijkstra())
})
