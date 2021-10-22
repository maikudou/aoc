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
  let tick = 1
  let tick2 = 0
  while (instructionPointer > -1 && instructionPointer < instructions.length) {
    const { name, operand1, operand2 } = instructions[instructionPointer]
    if (instructionPointer === 19) {
      // e and g grow by 1 in this cycle
      const iterationsTillNextZeroG = 0 - registers.g
      // // we need to know if it's possible what b == d * e during this cycle
      // if (
      //   registers.d * registers.e < registers.b &&
      //   registers.d * (registers.e + iterationsTillNextZeroG) > registers.b
      // ) {
      //   // if it's possible register f should be 0
      //   registers.f = 0
      // }
      registers.f = tick ? 0 : 1
      tick = registers.f
      registers.g = 0
      registers.e += iterationsTillNextZeroG
    }

    // if (instructionPointer === 20) {
    //   console.log(20, registers)
    // }

    if (instructionPointer === 23) {
      // d and g grow by 1 in this cycle
      // d shrinks by 1
      const iterationsTillNextZeroG = 0 - registers.g
      registers.g = 0
      registers.d += iterationsTillNextZeroG
      registers.f = tick2 == 0 ? 1 : tick2 == 1 ? 0 : tick2 == 2 ? 0 : 1
      tick2++
      if (tick2 > 3) {
        tick2 = 0
      }
    }

    // if (instructionPointer === 24) {
    //   console.log(24, registers)
    //   if (counter > 40) {
    //     process.exit(1)
    //   }
    //   counter++
    // }

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
  console.log(registers.h)
})
