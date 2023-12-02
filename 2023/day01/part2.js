var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let sum = 0

const numbers = [, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

lineReader.on('line', function (line) {
  let first = null,
    last = null
  let i = 0
  while (i < line.length) {
    let v = -1
    if (isNaN(line[i])) {
      const l3 = line.substr(i, 3)
      const l4 = `${l3}${line[i + 3]}`
      const l5 = `${l4}${line[i + 4]}`
      v = numbers.indexOf(l3)
      if (v === -1) {
        v = numbers.indexOf(l4)
        if (v === -1) {
          v = numbers.indexOf(l5)
        }
      }
    } else {
      v = parseInt(line[i], 10)
    }
    if (v > -1) {
      if (first === null) {
        first = 10 * v
      }
      last = v
    }
    i++
  }
  sum += first + last
  console.log(line, first + last)
})

lineReader.on('close', function () {
  console.log(sum)
})
