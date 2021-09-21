var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(`${__dirname}/input`)
})

const instructions = []
const buffer = [[], []]

lineReader.on('line', function (line) {
  const [_, instruction, operand1, operand2] = /(\w{3}) (-?\w)+(?: (-?\w+))*/.exec(line)

  instructions.push({
    name: instruction,
    operand1: isNaN(operand1) ? operand1 : parseInt(operand1, 10),
    operand2: isNaN(operand2) ? operand2 : parseInt(operand2, 10)
  })
})

function execute(registers, instructionPointer) {
  function value(operand) {
    if (isNaN(operand)) {
      return registers[operand] || 0
    } else {
      return operand
    }
  }

  registers.waiting = false

  const { name, operand1, operand2 } = instructions[instructionPointer]
  // console.log(name, operand1, operand2)

  switch (name) {
    case 'snd':
      buffer[registers.id].push(value(operand1))
      registers.sendCount++
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
      const last = buffer[registers.id ? 0 : 1].shift()
      if (last !== undefined) {
        registers[operand1] = last
        instructionPointer++
      } else {
        registers.waiting = true
      }
      break
    case 'jgz':
      if (value(operand1) > 0) {
        instructionPointer += value(operand2)
      } else {
        instructionPointer++
      }
      break
  }
  return instructionPointer
}

lineReader.on('close', function () {
  let instructionPointer0 = 0
  let instructionPointer1 = 0
  const registers0 = { p: 0, sendCount: 0, id: 0 }
  const registers1 = { p: 1, sendCount: 0, id: 1 }

  while (
    (instructionPointer0 > -1 && instructionPointer0 < instructions.length) ||
    (instructionPointer1 > -1 && instructionPointer1 < instructions.length)
  ) {
    if (instructionPointer0 > -1 && instructionPointer0 < instructions.length) {
      instructionPointer0 = execute(registers0, instructionPointer0)
    }
    if (instructionPointer1 > -1 && instructionPointer1 < instructions.length) {
      instructionPointer1 = execute(registers1, instructionPointer1)
    }
    if (registers0.waiting && registers1.waiting) {
      console.log(registers1.sendCount)
      process.exit(0)
    }
  }
})
