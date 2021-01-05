var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const theNumber = 248131121
let list = []
let sum = 0
const sorter = (a, b) => (a > b ? 1 : a == b ? 0 : -1)

lineReader.on('line', function (line) {
  const number = parseInt(line, 10)
  if (sum + number > theNumber) {
    let start = list.shift()
    while (start) {
      if (sum - start + number <= theNumber) {
        sum -= start
        break
      }
      sum -= start
      start = list.shift()
    }
  }
  if (sum + number === theNumber && list.length) {
    list.push(number)
    list.sort()
    console.log(list[0] + list.pop())
    process.exit(0)
  }

  list.push(number)
  sum += number
})

lineReader.on('close', function () {})
