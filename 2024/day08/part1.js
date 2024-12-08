const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const map = new Map()
const nodes = new Map()
const antinodes = new Set()
let width = 0
let height = 0

function makeAntinodes(nodeA, nodeB) {
  const [xA, yA] = nodeA.split('|').map(toDecimal)
  const [xB, yB] = nodeB.split('|').map(toDecimal)
  const diffX = Math.abs(xA - xB)
  const diffY = Math.abs(yA - yB)

  if (xA <= xB) {
    if (yA <= yB) {
      if (xA - diffX >= 0 && yA - diffY >= 0) {
        antinodes.add(`${xA - diffX}|${yA - diffY}`)
      }
      if (xB + diffX < width && yB + diffY < height) {
        antinodes.add(`${xB + diffX}|${yB + diffY}`)
      }
    } else {
      if (xA - diffX >= 0 && yA + diffY < height) {
        antinodes.add(`${xA - diffX}|${yA + diffY}`)
      }
      if (xB + diffX < width && yB - diffY >= 0) {
        antinodes.add(`${xB + diffX}|${yB - diffY}`)
      }
    }
  } else {
    if (yA <= yB) {
      if (xA + diffX < width && yA - diffY >= 0) {
        antinodes.add(`${xA + diffX}|${yA - diffY}`)
      }
      if (xB - diffX >= 0 && yB + diffY < height) {
        antinodes.add(`${xB - diffX}|${yB + diffY}`)
      }
    } else {
      if (xA + diffX < width && yA + diffY < height) {
        antinodes.add(`${xA + diffX}|${yA + diffY}`)
      }
      if (xB - diffX >= 0 && yB - diffY >= 0) {
        antinodes.add(`${xB - diffX}|${yB - diffY}`)
      }
    }
  }
}

lineReader.on('line', function (line) {
  width = line.length
  line.split('').forEach((node, index) => {
    if (node !== '.') {
      map.set(`${index}|${height}`, node)
      if (nodes.has(node)) {
        nodes.set(node, nodes.get(node).concat(`${index}|${height}`))
      } else {
        nodes.set(node, [`${index}|${height}`])
      }
    }
  })
  height++
})

lineReader.on('close', function () {
  Array.from(nodes.values()).forEach(nodeList => {
    for (let i = 0; i < nodeList.length; i++) {
      for (let j = 0; j < nodeList.length; j++) {
        if (i !== j) {
          makeAntinodes(nodeList[i], nodeList[j])
        }
      }
    }
  })
  console.log(antinodes.size)
})
