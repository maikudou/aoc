const toDecimal = require('../../utils/toDecimal')
const { Heap } = require('../../utils/Heap')

class MinHeap extends Heap {
  _compare(a, b) {
    return a.distTo < b.distTo
  }
}

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const map = []

lineReader.on('line', function (line) {
  const newLine = line.split('').map(toDecimal)
  const lineLength = line.length
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < lineLength; j++) {
      const nextValue = newLine[j + lineLength * i] + 1
      newLine.push(nextValue > 9 ? 1 : nextValue)
    }
  }
  map.push(newLine)
})

const distances = new Map()
function dijkstra(x, y, x1, y1) {
  if (distances.has(`${x}${y}->${x1}${y1}`) || distances.has(`${x1}${y1}->${x}${y}`)) {
    return distances.get(`${x}${y}->${x1}${y1}`)
  }

  const localMap = map.slice().map((v, rowIndex) =>
    v.map((vv, columnIndex) => ({
      value: vv,
      distTo: Infinity,
      x: columnIndex,
      y: rowIndex
    }))
  )

  let current = localMap[y][x]
  current.distTo = 0
  const visited = new Set()

  let heap = new MinHeap()
  while (current) {
    if (visited.has(`${current.x}|${current.y}`)) {
      current = heap.pop()
      continue
    }
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (Math.abs(i) !== Math.abs(j)) {
          const neihgbour = localMap[current.y + j] && localMap[current.y + j][current.x + i]
          if (neihgbour && !visited.has(`${neihgbour.x}|${neihgbour.y}`)) {
            neihgbour.distTo = Math.min(neihgbour.distTo, current.distTo + neihgbour.value)
            heap.insert(neihgbour)
          }
        }
      }
    }

    visited.add(`${current.x}|${current.y}`)
    if (current.x == x1 && current.y == y1) {
      distances.set(`${x}${y}->${x1}${y1}`, current.distTo)
      return current.distTo
    }
    current = heap.pop()
  }
}

lineReader.on('close', function () {
  const rowCount = map.length
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < rowCount; j++) {
      map.push(map[j + rowCount * i].map(value => (value + 1 > 9 ? 1 : value + 1)))
    }
  }

  console.log(dijkstra(0, 0, map[0].length - 1, map.length - 1))
})
