var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const counts = []

lineReader.on('line', function (line) {
  const bin = parseInt(line, 2)
  for (let i = 0; i < line.length; i++) {
    counts[i] = counts[i] || [0, 0]
    counts[i][Math.pow(2, i) & bin ? 1 : 0]++
  }
})

lineReader.on('close', function () {
  const { gamma, epsilon } = counts.reduce(
    (acc, value, index) => {
      acc.gamma += value[1] > value[0] ? Math.pow(2, index) : 0
      acc.epsilon += value[0] > value[1] ? Math.pow(2, index) : 0
      return acc
    },
    { gamma: 0, epsilon: 0 }
  )
  console.log(gamma * epsilon)
})
