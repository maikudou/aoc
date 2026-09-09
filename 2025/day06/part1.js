const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const operands = []
let operations = []

lineReader.on('line', function (line) {
  const split = line.trim().split(/\s+/)
  if (!isNaN(split[0])) {
    operands.push(split.map(toDecimal))
  } else {
    operations = split.slice(0)
  }
})

lineReader.on('close', function () {
  console.log(
    operands
      .reduce((acc, value) => {
        if (acc.length === 0) {
          acc = value.slice(0)
        } else {
          acc = acc.map((a, i) => {
            return operations[i] === '+' ? a + value[i] : a * value[i]
          })
        }
        return acc
      }, [])
      .reduce((acc, value) => acc + value, 0)
  )
})
