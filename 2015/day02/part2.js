var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var ribbon = 0

lineReader.on('line', function (line) {
  var dims = line.split('x')

  var ribbons = []
  ribbons.push(parseInt(dims[0] * 2 + dims[1] * 2, 10))
  ribbons.push(parseInt(dims[1] * 2 + dims[2] * 2, 10))
  ribbons.push(parseInt(dims[2] * 2 + dims[0] * 2, 10))

  ribbons = ribbons.sort(function (a, b) {
    return a - b
  })

  ribbon += ribbons[0] + dims[0] * dims[1] * dims[2]
})

lineReader.on('close', function () {
  console.log(ribbon)
})
