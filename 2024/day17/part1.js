const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let regA = 0
let regB = 0
let regC = 0
let pointer = 0
let program = []

const out = []

function opValue(operand) {
  if (operand < 4) {
    return operand
  } else if (operand === 4) {
    return regA
  } else if (operand === 5) {
    return regB
  } else if (operand === 6) {
    return regC
  }
}

lineReader.on('line', function (line) {
  if (line) {
    if (/Register (A|B|C): (\d+)/.test(line)) {
      const [_, reg, value] = /Register (A|B|C): (\d+)/.exec(line)
      if (reg === 'A') {
        regA = toDecimal(value)
      } else if (reg === 'B') {
        regB = toDecimal(value)
      } else {
        regC = toDecimal(value)
      }
    } else {
      const [_, p] = /Program: ([\d,]+)/.exec(line)
      program = p.split(',').map(toDecimal)
    }
  }
})

lineReader.on('close', function () {
  while (pointer >= 0 && pointer < program.length) {
    const opcode = program[pointer]
    const operand = program[pointer + 1]
    switch (opcode) {
      // adv
      case 0:
        regA = Math.floor(regA / Math.pow(2, opValue(operand)))
        pointer += 2
        break
      // bxl
      case 1:
        regB ^= operand
        pointer += 2
        break
      // bst
      case 2:
        regB = opValue(operand) % 8
        pointer += 2
        break
      // jnz
      case 3:
        if (regA) {
          pointer = operand
        } else {
          pointer += 2
        }
        break
      // bxc
      case 4:
        regB ^= regC
        pointer += 2
        break
      // out
      case 5:
        out.push(opValue(operand) % 8)
        pointer += 2
        break
      // bdv
      case 6:
        regB = Math.floor(regA / Math.pow(2, opValue(operand)))
        pointer += 2
        break
      // cdv
      case 7:
        regC = Math.floor(regA / Math.pow(2, opValue(operand)))
        pointer += 2
        break
    }
  }
  console.log(out.join(','))
})
