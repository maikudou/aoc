var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(`${__dirname}/input`)
})

const instructions = []
let instructionPointer = 0
const registers = {}
let sent

lineReader.on('line', function (line) {
  const [_, instruction, operand1, operand2] = /(\w{3}) (-?\w)+(?: (-?\w+))*/.exec(line)

  instructions.push({
    name: instruction,
    operand1: isNaN(operand1) ? operand1 : parseInt(operand1, 10),
    operand2: isNaN(operand2) ? operand2 : parseInt(operand2, 10)
  })
})

function value(operand) {
  if (isNaN(operand)) {
    return registers[operand] || 0
  } else {
    return operand
  }
}

lineReader.on('close', function () {
  while (instructionPointer > -1 && instructionPointer < instructions.length) {
    const { name, operand1, operand2 } = instructions[instructionPointer]
    // console.log(name, operand1, operand2)

    switch (name) {
      case 'snd':
        sent = value(operand1)
        instructionPointer++
        break
      case 'set':
        registers[operand1] = value(operand2)
        instructionPointer++
        break
      case 'add':
        registers[operand1] = value(operand1) + value(operand2)
        instructionPointer++
        break
      case 'mul':
        registers[operand1] = value(operand1) * value(operand2)
        instructionPointer++
        break
      case 'mod':
        registers[operand1] = value(operand1) % value(operand2)
        instructionPointer++
        break
      case 'rcv':
        if (value(operand1)) {
          console.log(sent)
          process.exit(0)
        }
        instructionPointer++
        break
      case 'jgz':
        if (value(operand1) > 0) {
          instructionPointer += value(operand2)
        } else {
          instructionPointer++
        }
        break
    }
    // console.log(instructionPointer, registers)
  }
})
