var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})
let score = 0
const equal = { A: 'X', B: 'Y', C: 'Z' }
const win = { A: 'Y', B: 'Z', C: 'X' }
const loose = { A: 'Z', B: 'X', C: 'Y' }
const price = { X: 1, Y: 2, Z: 3 }
lineReader.on('line', function (line) {
  const [opponent, outcome] = line.split(' ')
  const you = outcome === 'X' ? loose[opponent] : outcome === 'Y' ? equal[opponent] : win[opponent]
  score += price[you] + (outcome === 'Y' ? 3 : outcome === 'Z' ? 6 : 0)
})

lineReader.on('close', function () {
  console.log(score)
})
