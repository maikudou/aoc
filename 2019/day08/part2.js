var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var input
const columns = 25
const rows = 6
const layers = []
var minimal = Infinity
var minimalLayer
var image = [[], [], [], [], [], []]

lineReader.on('line', function (line) {
  input = line.split('').map(num => parseInt(num, 10))
})

lineReader.on('close', function () {
  var column = 0
  var row = 0
  for (var i = 0; i < input.length; i++) {
    const pixel = input[i]
    // console.log(layer, i);
    if (pixel !== 2 && typeof image[row][column] === 'undefined') {
      image[row][column] = pixel ? 'X' : '.'
    }
    column++
    if (column === columns) {
      column = 0
      row++
      if (row === rows) {
        row = 0
      }
    }
  }

  console.log(image.map(v => v.join(' ')).join('\n'))
})
