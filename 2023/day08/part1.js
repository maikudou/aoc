const { $0 } = require('prettier')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let instructions = null
let nodes = new Map()

lineReader.on('line', function (line) {
  if (line) {
    if (!instructions) {
      instructions = line
    } else {
      const [_, source, left, right] = /([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/g.exec(line)
      nodes.set(source, { L: left, R: right })
    }
  }
})

lineReader.on('close', function () {
  let steps = 0
  let currentNode = 'AAA'
  let pointer = 0
  while (true) {
    if (pointer == instructions.length) {
      pointer = 0
    }
    steps++
    currentNode = nodes.get(currentNode)[instructions[pointer]]
    if (currentNode === 'ZZZ') {
      console.log(steps)
      process.exit(0)
    }
    pointer++
  }
})
