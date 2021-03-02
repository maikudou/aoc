var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const preambleLength = 25
let prevNumbers = []
const sorter = (a, b) => (a > b ? 1 : a == b ? 0 : -1)

lineReader.on('line', function (line) {
  const number = parseInt(line, 10)
  if (prevNumbers.length == preambleLength) {
    const sortedNumbers = prevNumbers.slice(0).sort(sorter)
    let first
    let second
    while (sortedNumbers.length) {
      const top = sortedNumbers.pop()
      if (top < number) {
        first = top
        break
      }
    }
    while (first) {
      for (var i = sortedNumbers.length - 1; i >= 0; i--) {
        if (sortedNumbers[i] + first === number) {
          second = sortedNumbers[i]
          break
        }
      }
      if (second) {
        break
      }
      first = sortedNumbers.pop()
    }
    if (!second) {
      console.log(number)
      process.exit(1)
    }
  }

  prevNumbers.push(number)

  if (prevNumbers.length > preambleLength) {
    prevNumbers.shift()
  }
})

lineReader.on('close', function () {})
