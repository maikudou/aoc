var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let sum = 0

lineReader.on('line', function (line) {
  const digits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  let start = 0
  let digit = 0
  let i = 0

  const max = line.length - digits.length

  while (digit < digits.length) {
    while (i <= max + digit) {
      if (line[i] > digits[digit]) {
        digits[digit] = line[i]
        start = i + 1
      }
      i++
    }
    digit++
    i = start
  }

  sum += digits.reduce(
    (acc, value, index) => acc + value * Math.pow(10, digits.length - index - 1),
    0
  )
})

lineReader.on('close', function () {
  console.log(sum)
})
