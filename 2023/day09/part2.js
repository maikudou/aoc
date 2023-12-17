const { diff } = require('prettier')
const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let sum = 0

lineReader.on('line', function (line) {
  const diffs = [line.split(' ').map(toDecimal)]
  let diff = null
  while (true) {
    diff = diffs[diffs.length - 1].reduce((acc, value, index, array) => {
      if (index) {
        acc.push(array[index] - array[index - 1])
      }
      return acc
    }, [])

    if (diff.findIndex(d => d !== 0) === -1) {
      break
    }
    diffs.push(diff)
  }
  // console.log(diffs)
  sum += diffs.reduceRight((acc, value) => {
    acc = value[0] - acc
    return acc
  }, 0)
})

lineReader.on('close', function () {
  console.log(sum)
})
