var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var numbers = []

lineReader.on('line', function (line) {
  numbers.push(parseInt(line, 10))
})

lineReader.on('close', function () {
  numbers = numbers.sort((a, b) => {
    return a > b ? 1 : a == b ? 0 : -1
  })
  for (var i = numbers.length - 1; i >= 0; i--) {
    if (numbers[i] > 2020) {
      continue
    }
    for (var j = i - 1; j >= 0; j--) {
      if (numbers[i] + numbers[j] > 2020) {
        continue
      }
      for (var k = j - 1; k >= 0; k--) {
        if (numbers[i] + numbers[j] + numbers[k] === 2020) {
          console.log(numbers[i] * numbers[j] * numbers[k])
          process.exit(0)
        }
        if (numbers[i] + numbers[j] + numbers[k] > 2020) {
          continue
        }
        break
      }
    }
  }
})
