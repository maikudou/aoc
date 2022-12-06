var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

lineReader.on('line', function (line) {
  for (let i = 3; i < line.length; i++) {
    const set = new Set()
    set.add(line[i - 3])
    set.add(line[i - 2])
    set.add(line[i - 1])
    set.add(line[i])
    if (set.size === 4) {
      console.log(i + 1)
      break
    }
  }
})

lineReader.on('close', function () {})
