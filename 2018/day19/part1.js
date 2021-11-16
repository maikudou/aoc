const toDecimal = require('../../utils/toDecimal')
const runOpCode = require('../runOpCode')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let ip
const program = []

lineReader.on('line', function (line) {
  if (ip === undefined) {
    const [_, ipNum] = /^#ip (\d)$/.exec(line)
    ip = parseInt(ipNum, 10)
  } else {
    const [_, opCode, op1, op2, op3] = /^(\w{4}) (\d+) (\d+) (\d+)/.exec(line)
    program.push({ opCode, op1: toDecimal(op1), op2: toDecimal(op2), op3: toDecimal(op3) })
  }
})

const registers = [0, 0, 0, 0, 0, 0]

lineReader.on('close', function () {
  // console.log(registers)

  registers[ip] = 0
  while (registers[ip] >= 0 && registers[ip] < program.length) {
    const { opCode, op1, op2, op3 } = program[registers[ip]]
    runOpCode(opCode, op1, op2, op3, registers)
    // console.log(opCode, op1, op2, op3, registers)
    registers[ip]++
  }

  console.log(registers[0])
})
