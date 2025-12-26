var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let current = 50
let zeroCount = 0

lineReader.on('line', function (line) {
  const [_, dir, count] = /(\w)(\d+)/.exec(line)
  current = (current + (dir === 'L' ? -1 : 1) * parseInt(count, 10)) % 100
  if (current === 0) {
    zeroCount++
  }
})

lineReader.on('close', function () {
  console.log(zeroCount)
})
