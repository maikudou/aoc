var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let input = ''

lineReader.on('line', function (line) {
  input = line
})

lineReader.on('close', function () {
  const field = [input.split('')]
  var safeCount = input.split('').reduce(function (acc, value) {
    acc += value === '.' ? 1 : 0
    return acc
  }, 0)

  for (var i = 0; i < 39; i++) {
    var line = []
    for (var j = 0; j < input.length; j++) {
      if (field[i][j - 1] === '^' && field[i][j] === '^' && field[i][j + 1] !== '^') {
        line.push('^')
      } else if (field[i][j - 1] !== '^' && field[i][j] === '^' && field[i][j + 1] === '^') {
        line.push('^')
      } else if (field[i][j - 1] === '^' && field[i][j] !== '^' && field[i][j + 1] !== '^') {
        line.push('^')
      } else if (field[i][j - 1] !== '^' && field[i][j] !== '^' && field[i][j + 1] === '^') {
        line.push('^')
      } else {
        line.push('.')
        safeCount++
      }
    }
    field.push(line)
  }

  console.log(safeCount)
})
