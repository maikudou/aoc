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
let width = 0

lineReader.on('line', function (line) {
  line.split('').forEach((cell, index) => {
    if (!width) {
      width = line.length
    }
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
const backwards = { '>': '<', '<': '>', v: '^', '^': 'v' }

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
  map.set(`${current.x}|${current.y}|${current.facing}`, current.distTo)

  let heap = new MinHeap()
  let iterations = 0
  while (current) {
    const { x, y, distTo, facing } = current
    if (visited.has(`${x}|${y}|${facing}`)) {
      current = heap.pop()
      continue
    }

    const neighbors = [
      {
        x: x + 1,
        y: y,
        id: `${x + 1}|${y}|>`,
        facing: '>'
      },
      {
        x: x - 1,
        y: y,
        id: `${x - 1}|${y}|<`,
        facing: '<'
      },
      {
        x: x,
        y: y + 1,
        id: `${x}|${y + 1}|v`,
        facing: 'v'
      },
      {
        x: x,
        y: y - 1,
        id: `${x}|${y - 1}|^`,
        facing: '^'
      }
    ]
      .filter(
        neighbor =>
          backwards[facing] !== neighbor.facing && !walls.has(`${neighbor.x}|${neighbor.y}`)
      )
      .map(neighbor => ({
        ...neighbor,
        distTo: distTo + (neighbor.facing === facing ? 1 : 1001)
      }))

    neighbors.forEach(neighbor => {
      const id = `${neighbor.x}|${neighbor.y}|${neighbor.facing}`
      if (!map.has(id)) {
        map.set(id, neighbor.distTo)
      }
      heap.insert({
        distTo: Math.min(map.get(id), neighbor.distTo),
        x: neighbor.x,
        y: neighbor.y,
        facing: neighbor.facing
      })
    })

    visited.add(`${current.x}|${current.y}|${current.facing}`)

    if (current.x == endX && current.y == endY) {
      return map
    }
    current = heap.pop()
  }
  return map
}

lineReader.on('close', function () {
  const map = dijkstra()
  const [startX, startY] = startPosition.split('|').map(toDecimal)
  const [endX, endY] = endPosition.split('|').map(toDecimal)

  const tiles = ['^', '>', 'v', '<']
    .map(facing => {
      return {
        x: endX,
        y: endY,
        id: `${endX}|${endY}|${facing}`,
        distTo: map.get(`${endX}|${endY}|${facing}`) || Infinity,
        facing
      }
    })
    .sort((a, b) => a.dist - b.dist)

  const shortestDistance = tiles[0].dist
  // console.log(shortestDistance)

  const tiles2Check = tiles.filter(({ dist }) => dist === shortestDistance)

  const goodCells = new Set()

  while (tiles2Check.length) {
    const tile = tiles2Check.shift()
    const { x, y, distTo, facing } = tile

    goodCells.add(`${x}|${y}`)

    const art = ['^', '>', 'v', '<']
      .map(tile =>
        [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1]
        ].map(([xd, yd]) => ({
          x: x + xd,
          y: y + yd,
          id: `${x + xd}|${y + yd}|${tile}`,
          facing: tile
        }))
      )
      .flat()
      .filter(({ id }) => map.has(id))
      .map(tile => ({ ...tile, distTo: map.get(tile.id) }))
      .filter(tile =>
        tile.facing == facing ? tile.distTo === distTo - 1 : tile.distTo === distTo - 1001
      )

    art.forEach(t => tiles2Check.push(t))
  }

  console.log(goodCells.size)
})
