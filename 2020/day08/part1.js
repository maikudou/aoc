var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const program = []

lineReader.on('line', function (line) {
  program.push({
    instruction: line.slice(0, 3),
    value: parseInt(line.slice(4)),
    calls: 0
    inverted: false
  })
})

let acc = 0
let index = 0

lineReader.on('close', function () {
  let current = program[index]
  while (current.calls < 1) {
    switch (current.instruction) {
      case 'acc':
        acc += current.value
        index++
        break
      case 'jmp':
        index += current.value
        break
      default:
        index++
    }
    current.calls++
    current = program[index]
  }

  console.log(acc)
})
