var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var wrap = 0

lineReader.on('line', function (line) {
  var dims = line.split('x')
  var sums = []
  sums.push(parseInt(dims[0] * dims[1], 10))
  sums.push(parseInt(dims[1] * dims[2], 10))
  sums.push(parseInt(dims[2] * dims[0], 10))

  sums = sums.sort(function (a, b) {
    return a - b
  })

  wrap += sums[0] * 3 + sums[1] * 2 + sums[2] * 2
})

lineReader.on('close', function () {
  console.log(wrap)
})
