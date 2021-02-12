const { Heap } = require('../../utils/Heap')

class MinHeap extends Heap {
  _compare(a, b) {
    return a.distTo < b.distTo
  }
}

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})
const map = new Map()
const nodes = new Map()
const nodesByCoords = new Set()
let lineNum = 0

lineReader.on('line', function (line) {
  line.split('').forEach((value, index) => {
    if (value != '#') {
      map.set(`${index}|${lineNum}`, { x: index, y: lineNum, distTo: Infinity })
    }
    if (!isNaN(value)) {
      nodes.set(value, { x: index, y: lineNum })
      nodesByCoords.add(`${index}|${lineNum}`)
    }
  })
  lineNum++
})

const distances = new Map()

function dijkstra(x, y, x1, y1) {
  if (distances.has(`${x}|${y}->${x1}|${y1}`) || distances.has(`${x1}|${y1}->${x}|${y}`)) {
    return distances.get(`${x}|${y}->${x1}|${y1}`) || distances.get(`${x1}|${y1}->${x}|${y}`)
  }
  if (x == x1 && y == y1) {
    return 0
  }
  const localMap = new Map(
    Array.from(map.entries()).map(([key, value]) => {
      return [key, { ...value }]
    })
  )
  let current = localMap.get(`${x}|${y}`)
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
        if (i || j) {
          const neihgbour = localMap.get(`${current.x + i}|${current.y + j}`)
          if (neihgbour && !visited.has(`${neihgbour.x}|${neihgbour.y}`)) {
            neihgbour.distTo = Math.min(
              neihgbour.distTo,
              current.distTo + Math.abs(i) + Math.abs(j)
            )
            heap.insert(neihgbour)
          }
        }
      }
    }
    visited.add(`${current.x}|${current.y}`)
    if (current.x == x1 && current.y == y1) {
      distances.set(`${x}|${y}->${x1}|${y1}`, current.distTo)
      return current.distTo
    }
    current = heap.pop()
  }
}

function calcDistance(route) {
  let distance = 0
  let currentNode = route.shift()

  while (route.length) {
    let nextNode = route.shift()
    distance += dijkstra(currentNode[1].x, currentNode[1].y, nextNode[1].x, nextNode[1].y)
    currentNode = nextNode
  }

  return distance
}

lineReader.on('close', function () {
  // console.log(map)
  // console.log(nodes)
  const nodesArray = Array.from(nodes.entries())
  nodesArray.forEach(([node, coords]) => {
    nodesArray.forEach(([onode, ocoords]) => {
      if (node !== onode) {
        dijkstra(coords.x, coords.y, ocoords.x, ocoords.y)
      }
    })
  })

  const zeroNode = ['0', nodes.get('0')]
  nodes.delete('0')

  results = []
  function permute(array, localResults) {
    var cur,
      localResults = localResults || []

    for (var i = 0; i < array.length; i++) {
      cur = array.splice(i, 1)
      if (array.length === 0) {
        results.push(localResults.concat(cur))
      }
      permute(array.slice(), localResults.concat(cur))
      array.splice(i, 0, cur[0])
    }

    return results
  }
  permute(nodesArray.slice(0))
  let minDistance = Infinity
  results.forEach(array => {
    minDistance = Math.min(minDistance, calcDistance([zeroNode, ...array, zeroNode]))
  })

  console.log(minDistance)
})
