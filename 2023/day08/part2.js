const { $0 } = require('prettier')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let instructions = null
let nodes = new Map()
let currentNodes = []

lineReader.on('line', function (line) {
  if (line) {
    if (!instructions) {
      instructions = line
    } else {
      const [_, source, left, right] = /(\w{3}) = \((\w{3}), (\w{3})\)/g.exec(line)
      nodes.set(source, { L: left, R: right })
      if (source[2] === 'A') {
        currentNodes.push(source)
      }
    }
  }
})

lineReader.on('close', function () {
  let steps = 0
  let pointer = 0

  while (true) {
    if (pointer == instructions.length) {
      pointer = 0
    }
    steps++
    let allGood = true
    currentNodes = currentNodes.map(currentNode => {
      const node = nodes.get(currentNode)[instructions[pointer]]
      if (node[2] !== 'Z') {
        allGood = false
      }
      return node
    })
    if (allGood) {
      console.log(steps)
      process.exit(0)
    }
    pointer++
  }
})
