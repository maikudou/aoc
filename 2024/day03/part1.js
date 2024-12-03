var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var sum = 0

lineReader.on('line', function (line) {
  const matcher = /mul\(\d+,\d+\)/g
  line.match(matcher).forEach(match => {
    const [, a, b] = /mul\((\d+),(\d+)\)/.exec(match)
    sum += parseInt(a, 10) * parseInt(b, 10)
  })
})

lineReader.on('close', function () {
  console.log(sum)
})
