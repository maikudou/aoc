var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var count = 0

lineReader.on('line', function (line) {
  const inBrackets = []
  const regex = /\[([^\[\]]+)\]/g
  var result
  while ((result = regex.exec(line))) {
    inBrackets.push(result[1])
  }
  const notInBrackets = line.replace(/\[([^\[\]]+)\]/g, '|')

  var ssl = false
  for (var i = 0; i < inBrackets.length; i++) {
    var group = inBrackets[i]
    for (var j = 1; j < group.length - 1; j++) {
      if (group[j - 1] === group[j + 1] && group[j - 1] !== group[j]) {
        if (notInBrackets.indexOf(`${group[j]}${group[j - 1]}${group[j]}`) > -1) {
          ssl = true
          break
        }
      }
    }

    if (ssl) {
      count++
      break
    }
  }
})

lineReader.on('close', function () {
  console.log(count)
})
