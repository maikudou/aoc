var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const program = []

lineReader.on('line', function (line) {
  program.push({
    instruction: line.slice(0, 3),
    value: parseInt(line.slice(4)),
    calls: 0,
    inverted: false
  })
})

let acc = 0
let index = 0
let wasInverted = false

const path = []

function backtrack() {
  let next = path.pop()
  while(next) {
    if (next.inverted) {
      next.inverted = false
      wasInverted = false
      if(next.instruction == 'jmp') {
        index--
        index += next.value
      } else {
        index -= next.value
        index++
      }
      path.push(next)
      next = null
    } else {
      switch (next.instruction) {
        case 'acc':
          acc -= next.value
          index--
          break
        case 'jmp':
          index -= next.value
          break
        default:
          index--
      }
      next.calls--
      next = path.pop()

  }
}

lineReader.on('close', function () {
  let current = program[index]
  while (index < program.length) {
    if (current.calls) {
      backtrack()
      current = program[index]
      path.push(current)
      continue
    }
    path.push(current)
    switch (current.instruction) {
      case 'acc':
        acc += current.value
        index++
        break
      case 'jmp':
        if (wasInverted) {
          index += current.value
        } else {
          current.inverted = true
          wasInverted = true
          index++
        }
        break
      default:
        if (wasInverted) {
          index++
        } else {
          current.inverted = true
          wasInverted = true
          index += current.value
        }
    }
    current.calls++
    current = program[index
  }
  console.log(acc)
})
