var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})
let score = 0
const equal = { A: 'X', B: 'Y', C: 'Z' }
const win = { A: 'Y', B: 'Z', C: 'X' }
const price = { X: 1, Y: 2, Z: 3 }
lineReader.on('line', function (line) {
  const [opponent, you] = line.split(' ')
  score += price[you] + (equal[opponent] === you ? 3 : win[opponent] === you ? 6 : 0)
})

lineReader.on('close', function () {
  console.log(score)
})
