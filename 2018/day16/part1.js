const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let spacesCount = 0
let stop = false
let before
let instruction
let after

let beforeRE = /^Before:\s+\[(\d+), (\d+), (\d+), (\d+)\]$/
let afterRE = /^After:\s+\[(\d+), (\d+), (\d+), (\d+)\]$/
let instructionRE = /^(\d+) (\d+) (\d+) (\d+)$/

let threePlusCount = 0

const opcodes = [
  'addr',
  'addi',
  'mulr',
  'muli',
  'banr',
  'bani',
  'borr',
  'bori',
  'setr',
  'seti',
  'gtir',
  'gtri',
  'gtrr',
  'eqir',
  'eqri',
  'eqrr'
]

function runOpCode(opcode, op1, op2, op3, registers) {
  // console.log(opcode, op1, op2, op3, registers)
  switch (opcode) {
    case 'addr':
      registers[op3] = registers[op1] + registers[op2]
      break
    case 'addi':
      registers[op3] = registers[op1] + op2
      break
    case 'mulr':
      registers[op3] = registers[op1] * registers[op2]
      break
    case 'muli':
      registers[op3] = registers[op1] * op2
      break
    case 'banr':
      registers[op3] = registers[op1] & registers[op2]
      break
    case 'bani':
      registers[op3] = registers[op1] & op2
      break
    case 'borr':
      registers[op3] = registers[op1] | registers[op2]
      break
    case 'bori':
      registers[op3] = registers[op1] | op2
      break
    case 'setr':
      registers[op3] = registers[op1]
      break
    case 'seti':
      registers[op3] = op1
      break
    case 'gtir':
      registers[op3] = op1 > registers[op2] ? 1 : 0
      break
    case 'gtri':
      registers[op3] = registers[op1] > op2 ? 1 : 0
      break
    case 'gtrr':
      registers[op3] = registers[op1] > registers[op2] ? 1 : 0
      break
    case 'eqir':
      registers[op3] = op1 === registers[op2] ? 1 : 0
      break
    case 'eqri':
      registers[op3] = registers[op1] === op2 ? 1 : 0
      break
    case 'eqrr':
      registers[op3] = registers[op1] === registers[op2] ? 1 : 0
      break
  }
  // console.log(opcode, registers)
  return registers
}

lineReader.on('line', function (line) {
  if (!stop) {
    if (line === '') {
      spacesCount++
    } else {
      spacesCount = 0
    }
    if (spacesCount === 3) {
      stop = true
    }
    if (beforeRE.test(line)) {
      before = beforeRE.exec(line).slice(1).map(toDecimal)
    }
    if (instructionRE.test(line)) {
      instruction = instructionRE.exec(line).slice(1).map(toDecimal)
    }
    if (afterRE.test(line)) {
      after = afterRE.exec(line).slice(1).map(toDecimal)
      const count = opcodes.reduce((acc, opcode) => {
        acc +=
          runOpCode(opcode, instruction[1], instruction[2], instruction[3], before.slice(0)).join(
            ''
          ) === after.join('')
            ? 1
            : 0
        return acc
      }, 0)
      if (count >= 3) {
        threePlusCount++
      }
    }
  }
})

lineReader.on('close', function () {
  console.log(threePlusCount)
})
