const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const operandLines = []
let operationLine

lineReader.on('line', function (line) {
  if (line[0] && !isNaN(line[0])) {
    operandLines.push(line)
  } else {
    operationLine = `${line} `
  }
})

lineReader.on('close', function () {
  const columnStarts = operationLine.split(/\*|\+/).reduce((acc, value) => {
    if (acc.length === 0) {
      acc.push(0)
    } else {
      acc.push(acc[acc.length - 1] + value.length + 1)
    }
    return acc
  }, [])

  const operands = operationLine.trim().split(/\s+/)

  let sum = 0
  for (let i = 0; i < columnStarts.length - 1; i++) {
    const start = columnStarts[i]
    const end = columnStarts[i + 1]
    const operand = operands[i]
    let numbers = []
    for (let j = start; j < end - 1; j++) {
      const number = operandLines.reduce((acc, value) => {
        return `${acc}${value[j]}`
      }, '')

      numbers.push(toDecimal(number))
    }
    sum += numbers.reduce((acc, value) => {
      return acc === null ? value : operand === '*' ? acc * value : acc + value
    }, null)
  }
  console.log(sum)
})
