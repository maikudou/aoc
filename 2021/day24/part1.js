const { appendFileSync, unlinkSync } = require('fs')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const program = []
let registers = { w: 0, x: 0, y: 0, z: 0 }

lineReader.on('line', function (line) {
  const [_, inst, a, b] = /(add|mul|inp|eql|mod|div) (\S+)(?: (\S+))?/.exec(line)
  program.push({ inst, a, b })
})

function value(v) {
  if (isNaN(v)) {
    return registers[v]
  } else {
    return parseInt(v, 10)
  }
}

lineReader.on('close', function () {
  const inputs = []
  for (let i = 1; i < 15; i++) {
    inputs.push(`i${i}`)
  }
  console.log(inputs)
  registers = { w: 0, x: 0, y: 0, z: 0 }
  let pointer = 0
  while (pointer < program.length) {
    const step = program[pointer]
    const op2Value = value(step.b)
    // console.log(pointer + 1, step.inst, step.a, step.b)

    switch (step.inst) {
      case 'inp':
        registers[step.a] = inputs.shift()
        break
      case 'add':
        if (isNaN(op2Value)) {
          if (registers[step.a]) {
            registers[step.a] = `(${registers[step.a]}) + (${op2Value})`
          } else {
            registers[step.a] = op2Value
          }
        } else {
          if (op2Value) {
            if (registers[step.a]) {
              registers[step.a] = `(${registers[step.a]}) + (${op2Value})`
            } else {
              registers[step.a] = op2Value
            }
          }
        }
        // registers[step.a] += isNaN(parseInt(step.b, 10)) ? registers[step.b] : parseInt(step.b, 10)
        break
      case 'mul':
        if (registers[step.a] && op2Value != 1) {
          if (isNaN(op2Value)) {
            registers[step.a] = `(${registers[step.a]}) * (${op2Value})`
          } else {
            if (op2Value) {
              registers[step.a] = `(${registers[step.a]}) * (${op2Value})`
            } else {
              registers[step.a] = 0
            }
          }
        }
        // registers[step.a] *= isNaN(parseInt(step.b, 10)) ? registers[step.b] : parseInt(step.b, 10)
        break
      case 'div':
        if (registers[step.a] && op2Value != 1) {
          if (isNaN(op2Value)) {
            registers[step.a] = `Math.floor((${registers[step.a]}) / (${op2Value}))`
          } else {
            if (op2Value) {
              registers[step.a] = `Math.floor((${registers[step.a]}) / ${op2Value})`
            }
          }
        }
        // registers[step.a] /= Math.floor(
        //   isNaN(parseInt(step.b, 10)) ? registers[step.b] : parseInt(step.b, 10)
        // )
        break
      case 'mod':
        if (registers[step.a]) {
          if (isNaN(op2Value)) {
            registers[step.a] = `(${registers[step.a]}) % (${op2Value})`
          } else {
            if (registers[step.a]) {
              registers[step.a] = `(${registers[step.a]}) % (${op2Value})`
            }
          }
        }
        // registers[step.a] =
        //   registers[step.a] % isNaN(parseInt(step.b, 10)) ? registers[step.b] : parseInt(step.b, 10)
        break
      case 'eql':
        if (isNaN(op2Value)) {
          registers[step.a] = `(${registers[step.a]}) == (${op2Value}) ? 1 : 0`
        } else {
          registers[step.a] = `(${registers[step.a]}) == (${op2Value}) ? 1 : 0`
        }
      // registers[step.a] = (
      //   registers[step.a] == isNaN(parseInt(step.b, 10))
      //     ? registers[step.b]
      //     : parseInt(step.b, 10)
      // )
      //   ? 1
      //   : 0
    }
    pointer++
    // console.log(registers)
  }
  let result = registers.z
  console.log(result.length)

  result = result
    .replaceAll('(((11) == (i1) ? 1 : 0) == (0) ? 1 : 0)', '1')
    .replaceAll('((i3) + (13))', '(i3 + 13)')
    .replaceAll('((i1) + (6))', '(i1 + 6)')
    .replaceAll('((i1 + 6) * 1)', '(i1 + 6)')
    .replaceAll('((i2) + (14))', '(i2 + 14)')
    .replaceAll('(0)', '0')
    .replaceAll('(1)', '1')
    .replaceAll('(11)', '11')
    .replaceAll('(26)', '26')
    .replaceAll('(i2)', 'i2')
    .replaceAll('(i3)', 'i3')
    .replaceAll('(i4)', 'i4')
    .replaceAll('(i5)', 'i5')
    .replaceAll('(i6)', 'i6')
    .replaceAll('(i7)', 'i7')
    .replaceAll('(i8)', 'i8')
    .replaceAll('(i9)', 'i9')
    .replaceAll('(i10)', 'i10')
    .replaceAll('(i11)', 'i11')
    .replaceAll('(i12)', 'i12')
    .replaceAll('(i13)', 'i13')
    .replaceAll('(i14)', 'i14')
    .replaceAll('(((((i1 + 6) % 26) + 11) == i2 ? 1 : 0) == 0 ? 1 : 0)', '1')
    .replaceAll('(25)', '25')
    .replaceAll('(26)', '26')
    .replaceAll('(15)', '15')
    .replaceAll('((25 * 1) + 1))', '26')
    .replaceAll('((i2 + 14) * 1)', '(i2 + 14)')
    .replaceAll(' + (-14)', ' -14')
    .replaceAll('(((((i1 + 6) * 26 + (i2 + 14)) % 26) + 15) == i3 ? 1 : 0)', '0')
    .replaceAll('(0 == 0 ? 1 : 0)', '1')
    .replaceAll('((25 * (1) + 1))', '26')
    .replaceAll('((i3 + 13) * (1))', '(i3 + 13)')
    .replaceAll('(10)', '10')
    .replaceAll(' + (-9)', ' -9')
    .replaceAll(' + (-2)', ' -2')
    .replaceAll('(((((i1 + 6) * 26 + (i2 + 14)) * 26 + (i3 + 13) % 26) -14) == i4 ? 1 : 0)', '0')
    .replaceAll('((0 == 0 ? 1 : 0))', '1')
    .replaceAll('((1) % 26)', '1')
    .replaceAll('25 * ((1 + 1))', '50')
    .replaceAll(' + (-3)', ' -3')
    .replaceAll(' + (-6)', ' -6')
    .replaceAll('(i4 + 1) * 1 + 10', '(i4 + 11)')
    .replaceAll('(1) * ', '')
    .replaceAll('((50 + ((i4 + 11)) == i5 ? 1 : 0) == 0 ? 1 : 0)', '1')
    .replaceAll(' * 1)', ')')

  console.log(result.length)
  unlinkSync('./math.txt')
  for (let i = 0; i < result.length; i += 80) {
    appendFileSync('./math.txt', result.substr(i, 80))
    appendFileSync('./math.txt', '\n')
  }
})
