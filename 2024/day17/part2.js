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
  const mins = []

  const findNextMin = (min, result, power) => {
    let i = 0
    while (true) {
      const acc = Math.floor((i * Math.pow(8, power)) / Math.pow(8, power))
      const newMin = i * Math.pow(8, power)
      if ((acc % 8 ^ 3 ^ (acc / Math.pow(2, acc % 8 ^ 3)) ^ 5) % 8 === result && newMin > min) {
        return newMin
      }
      i++
    }
  }

  program
    .slice()
    .reverse()
    .forEach((v, index) => {
      mins.push(findNextMin(0, parseInt(v, 10), program.length - index - 1))
    })

  // mins.forEach(m => {
  //   console.log(m)
  //   console.log(m / 8)
  //   console.log('---')
  // })

  // mins
  //   .slice()
  //   .reverse()
  //   .forEach((v, index) => {
  //     const acc = Math.floor(v / Math.pow(8, index))
  //     console.log((acc % 8 ^ 3 ^ (acc / Math.pow(2, acc % 8 ^ 3)) ^ 5) % 8)
  //   })

  let index = 0

  while (index < mins.length - 1) {
    const min8 = mins[0] / Math.pow(8, index + 1)
    if (min8 < mins[index + 1]) {
      index = 0
      mins[0] = findNextMin(
        mins[0],
        parseInt(program[program.length - index - 1], 10),
        program.length - index - 1
      )
      continue
    }
    index++
  }

  console.log(mins, mins[0])
  // regA = mins[0]
  let i = mins[0]
  while (true) {
    if (
      program
        .slice()
        .reverse()
        .every((value, index) => {
          const acc = Math.floor(i / Math.pow(8, program.length - index - 1))
          return parseInt(value, 10) === (acc % 8 ^ 3 ^ (acc / Math.pow(2, acc % 8 ^ 3)) ^ 5) % 8
        })
    ) {
      console.log(i)
      process.exit(0)
    }
    i++
  }
})
