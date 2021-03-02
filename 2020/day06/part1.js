var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/test')
})

let sum = 0
let currentSet = new Set()

lineReader.on('line', function (line) {
  if (!line) {
    sum += currentSet.size
    currentSet = new Set()
  } else {
    for (var i = 0; i < line.length; i++) {
      currentSet.add(line[i])
    }
  }
})

lineReader.on('close', function () {
  sum += currentSet.size

  console.log(sum)
})
