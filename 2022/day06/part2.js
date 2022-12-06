var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

lineReader.on('line', function (line) {
  for (let i = 13; i < line.length; i++) {
    const set = new Set()
    for (j = 13; j >= 0; j--) {
      set.add(line[i - j])
    }
    if (set.size === 14) {
      console.log(i + 1)
      break
    }
  }
})

lineReader.on('close', function () {})
