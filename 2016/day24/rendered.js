const { Heap } = require('../../utils/Heap')
const { createCanvas } = require('canvas')
const { createWriteStream, writeFileSync } = require('fs')
const { join } = require('path')

class MinHeap extends Heap {
  _compare(a, b) {
    return a.distTo < b.distTo
  }
}

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/test')
})
const map = new Map()
const nodes = new Map()
const nodesByCoords = new Set()
let lineNum = 0
const multiplier = 8

var canvas = createCanvas(180 * multiplier, 43 * multiplier)
var ctx = canvas.getContext('2d')
ctx.fillStyle = 'black'
ctx.fillRect(0, 0, 180 * multiplier, 43 * multiplier)

function paint(x, y, mode, active = false) {
  switch (mode) {
    case 'wall':
      ctx.fillStyle = 'gray'
      ctx.fillRect(x * multiplier, y * multiplier, multiplier, multiplier)
      break
    case 'space':
      ctx.fillStyle = active ? 'yellow' : 'white'
      ctx.fillRect(x * multiplier, y * multiplier, multiplier, multiplier)
      break
    case 'node':
      ctx.fillStyle = active ? 'yellow' : 'white'
      ctx.fillRect(x * multiplier, y * multiplier, multiplier, multiplier)
      ctx.fillStyle = 'blue'
      ctx.fillRect(
        x * multiplier + multiplier / 4,
        y * multiplier + multiplier / 4,
        multiplier / 2,
        multiplier / 2
      )
      break
  }
}

lineReader.on('line', function (line) {
  line.split('').forEach((value, index) => {
    if (value != '#') {
      map.set(`${index}|${lineNum}`, { x: index, y: lineNum, distTo: Infinity })
    }
    if (!isNaN(value)) {
      // paint(index, lineNum, 'node')
      nodes.set(value, { x: index, y: lineNum })
      nodesByCoords.add(`${index}|${lineNum}`)
    } else {
      // paint(index, lineNum, value == '#' ? 'wall' : 'space')
    }
  })
  lineNum++
})

const distances = new Map()

function dijkstra(x, y, x1, y1) {
  let iteration = 0
  if (distances.has(`${x}${y}->${x1}${y1}`) || distances.has(`${x1}${y1}->${x}${y}`)) {
    return distances.get(`${x}${y}->${x1}${y1}`)
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
    // paint(
    //   current.x,
    //   current.y,
    //   nodesByCoords.has(`${current.x}|${current.y}`) ? 'node' : 'space',
    //   true
    // )
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
    // var out = join(__dirname, 'render', `${iteration}.png`)
    // writeFileSync(out, canvas.toBuffer())

    visited.add(`${current.x}|${current.y}`)
    if (current.x == x1 && current.y == y1) {
      distances.set(`${x}${y}->${x1}${y1}`, current.distTo)
      return current.distTo
    }
    current = heap.pop()
    iteration++
  }
}

lineReader.on('close', function () {
  // console.log(map)
  console.log(nodes)

  // var out = join(__dirname, 'render', `!start.png`)
  // writeFileSync(out, canvas.toBuffer())

  const neihgbours = []
  Array.from(nodes.entries()).forEach(([id, node]) => {
    if (id !== '0') {
      neihgbours.push({
        ...node,
        distTo: Infinity
      })
    } else {
      currentNode = {
        ...node,
        distTo: 0
      }
    }
  })

  console.log(currentNode, neihgbours)
  console.log(dijkstra(1, 1, 9, 3))
})
