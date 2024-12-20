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
  for (let i = 5048983231; i < 100000000000000000; i++) {
    if (i % 500000000 === 0) {
      console.log(i)
    }
    if (
      program.slice(0, 11).some((num, index) => {
        const j = i / Math.pow(8, index)
        return (j % 8 ^ 3 ^ (j / Math.pow(2, j % 8 ^ 3)) ^ 5) % 8 !== num
      })
    ) {
      continue
    }

    console.log(i)
  }
})
