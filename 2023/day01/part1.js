var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let sum = 0

lineReader.on('line', function (line) {
  const [first, last] = line.split('').reduce(
    (acc, value) => {
      if (isNaN(value)) {
        return acc
      }
      const v = parseInt(value, 10)
      if (acc[0] === null) {
        acc[0] = v * 10
      }
      acc[1] = v
      return acc
    },
    [null, null]
  )
  sum += first + last
})

lineReader.on('close', function () {
  console.log(sum)
})
