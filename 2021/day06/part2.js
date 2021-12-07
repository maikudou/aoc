const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let fish

lineReader.on('line', function (line) {
  fish = line
    .split(',')
    .map(toDecimal)
    .reduce(
      (acc, value) => {
        acc[value] = acc[value] + 1 || 1
        return acc
      },
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    )
})

lineReader.on('close', function () {
  for (var i = 0; i < 256; i++) {
    const zeroes = fish[0]

    fish[0] = fish[1]
    fish[1] = fish[2]
    fish[2] = fish[3]
    fish[3] = fish[4]
    fish[4] = fish[5]
    fish[5] = fish[6]
    fish[6] = fish[7] + zeroes
    fish[7] = fish[8]

    fish[8] = zeroes
  }
  console.log(fish.reduce((acc, value) => acc + value, 0))
})
