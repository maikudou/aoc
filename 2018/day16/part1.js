const toDecimal = require('../../utils/toDecimal')
const runOpCode = require('../runOpCode')

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
