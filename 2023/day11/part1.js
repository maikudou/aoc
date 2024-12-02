var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/test')
})

const map = []
const emptyRows = new Set()
const emptyCols = new Set()
let index = 0

lineReader.on('line', function (line) {
  map.push(line.split('').map(c => c == '#'))
  if (line.indexOf('#') < 0) {
    emptyRows.add(index)
  }
  index++
})

lineReader.on('close', function () {
  console.log(emptyRows)
  for (let i = 0; i < map[0].length; i++) {
    if (!map.some(row => row[i])) {
      emptyCols.add(i)
    }
  }
  console.log(emptyCols)
})
