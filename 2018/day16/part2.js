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
