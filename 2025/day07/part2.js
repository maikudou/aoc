var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let rays = new Set()
const nodes = new Map()
let lineNum = 0
let startNode = null
const lines = []
lineReader.on('line', function (line) {
  if (/^\.+$/.test(line)) {
    return
  }
  lines.push(line)
  if (/S/.test(line)) {
    rays.add(line.indexOf('S'))
    return
  }
  let lastIndex = line.indexOf('^')
  while (lastIndex > -1) {
    if (rays.has(lastIndex)) {
      nodes.set(`${lineNum},${lastIndex}`, {
        row: lineNum,
        ind: lastIndex,
        splitsDown: null,
        options: null
      })
      if (nodes.size === 1) {
        startNode = nodes.get(`${lineNum},${lastIndex}`)
      }
      rays.add(lastIndex - 1)
      rays.add(lastIndex + 1)
      rays.delete(lastIndex)
    }
    lastIndex = line.indexOf('^', lastIndex + 1)
  }
  lineNum++
})

function findNext(row, index) {
  while (row < lineNum) {
    if (nodes.has(`${row},${index}`)) {
      return nodes.get(`${row},${index}`)
    } else {
      row++
    }
  }
}

function nodeOptions(node) {
  if (!node) {
    return 1
  }
  if (node.options !== null) {
    return node.options
  }
  const left = findNext(node.row, node.ind - 1)
  const right = findNext(node.row, node.ind + 1)

  node.options = nodeOptions(left) + nodeOptions(right)
  return node.options
}

lineReader.on('close', function () {
  // recursive with dynamic programming
  console.log(nodeOptions(startNode))
})
