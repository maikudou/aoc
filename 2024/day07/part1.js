const toDecimal = require('../../utils/toDecimal')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})
let total = 0
lineReader.on('line', function (line) {
  let [_, test, values] = /(\d+)\: (.+)$/.exec(line)
  test = toDecimal(test)
  values = values.split(' ').map(toDecimal)
  const toTest = [{ values: values.slice(0), sum: 0 }]
  while (toTest.length) {
    const current = toTest.shift()
    const digit = current.values.shift()

    const option1 = { ...current, values: current.values.slice(), sum: current.sum + digit }
    const option2 = { ...current, values: current.values.slice(), sum: current.sum * digit }
    if (current.values.length === 0 && (option1.sum === test || option2.sum === test)) {
      total += test
      break
    }
    if (current.values.length) {
      if (option1.sum <= test) {
        toTest.push(option1)
      }
      if (option2.sum <= test) {
        toTest.push(option2)
      }
    }
  }
})

lineReader.on('close', function () {
  console.log(total)
})
