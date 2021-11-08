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

let opCodesSamples = []
const opCodes4Sure = []

const program = []

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
      // console.log(line, instructionRE.exec(line))
    }
    if (afterRE.test(line)) {
      after = afterRE.exec(line).slice(1).map(toDecimal)
      const sample = []
      opcodes.forEach(opcode => {
        const result = runOpCode(
          opcode,
          instruction[1],
          instruction[2],
          instruction[3],
          before.slice(0)
        ).join('')
        if (result === after.join('')) {
          // console.log(instruction)
          sample.push([instruction[0], opcode])
        }
      })
      opCodesSamples.push(sample)
    }
  } else {
    program.push(instructionRE.exec(line).slice(1).map(toDecimal))
  }
})

lineReader.on('close', function () {
  while (opCodesSamples.length) {
    opCodesSamples = opCodesSamples.reduce((acc, sample) => {
      if (sample.length === 1) {
        opCodes4Sure[sample[0][0]] = sample[0][1]
      } else {
        const result = sample.filter(sampleItem => {
          return opCodes4Sure.indexOf(sampleItem[1]) === -1
        })
        result.length && acc.push(result)
      }
      return acc
    }, [])
    // console.log(opCodesSamples)
    // process.exit(1)
  }
  const registers = [0, 0, 0, 0]
  program.forEach(step => {
    runOpCode(opCodes4Sure[step[0]], step[1], step[2], step[3], registers)
  })
  console.log(registers[0])
})
