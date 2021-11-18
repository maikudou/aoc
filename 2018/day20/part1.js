var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let input

lineReader.on('line', function (line) {
  input = line
})

const nodes = new Map()

let max = 0

function getMax(node) {
  const toConsider = [node]
  while (toConsider.length) {
    const next = toConsider.shift()
    // console.log(next)
    ;[
      ...(next.N ? [next.N] : []),
      ...(next.E ? [next.E] : []),
      ...(next.S ? [next.S] : []),
      ...(next.W ? [next.W] : [])
    ]
      .filter(cNode => cNode.dist == undefined)
      .map(cNode => {
        cNode.dist = next.dist + 1
        max = Math.max(max, next.dist + 1)
        toConsider.push(cNode)
        return cNode
      })
  }
}

lineReader.on('close', function () {
  // console.log(input)
  const startNode = { dist: 0, x: 0, y: 0 }
  nodes.set(`0|0`, startNode)
  let pointer = 1
  let currentNodes = [startNode]
  let nodeStack = []
  let nodeVariants = []
  while (input[pointer] !== '$') {
    switch (input[pointer]) {
      case '(':
        nodeStack.push(currentNodes)
        nodeVariants = []
        break
      case ')':
        nodeStack.pop()
        currentNodes = nodeVariants
        break
      case '|':
        currentNodes = nodeStack[nodeStack.length - 1]
        nodeVariants = nodeVariants.concat(currentNodes)
        break
      default:
        currentNodes = currentNodes.map(currentNode => {
          let newNode = { x: currentNode.x, y: currentNode.y }
          switch (input[pointer]) {
            case 'N':
              newNode.y--
              break
            case 'E':
              newNode.x++
              break
            case 'S':
              newNode.y++
              break
            case 'W':
              newNode.x--
              break
          }

          newNode = nodes.has(`${newNode.x}|${newNode.y}`)
            ? nodes.get(`${newNode.x}|${newNode.y}`)
            : newNode

          currentNode[input[pointer]] = newNode

          nodes.set(`${newNode.x}|${newNode.y}`, newNode)

          return newNode
        })
    }
    pointer++
  }
  getMax(startNode)
  console.log(max)
})
