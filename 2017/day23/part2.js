var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(`${__dirname}/input`)
})

const instructions = []
let instructionPointer = 0
const registers = { a: 1 }
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
  let cycle23Delta = null
  let counter = 0

  while (instructionPointer > -1 && instructionPointer < 10) {
    const { name, operand1, operand2 } = instructions[instructionPointer]

    switch (name) {
      case 'set':
        registers[operand1] = value(operand2)
        instructionPointer++
        break
      case 'sub':
        registers[operand1] = value(operand1) - value(operand2)
        instructionPointer++
        break
      case 'mul':
        registers[operand1] = value(operand1) * value(operand2)
        instructionPointer++
        break
      case 'jnz':
        if (value(operand1) !== 0) {
          instructionPointer += value(operand2)
        } else {
          instructionPointer++
        }
        break
    }
  }
  console.log(registers)

  while (true) {
    registers.f = 1
    registers.d = 2
    do {
      if (registers.b % registers.d == 0) registers.f = 0

      registers.d++
    } while (registers.d !== registers.b)

    if (registers.f == 0) {
      registers.h = (registers.h || 0) + 1
    }
    if (registers.b == registers.c) {
      console.log(registers.h)
      process.exit()
    }
    registers.b += 17
  }
})
