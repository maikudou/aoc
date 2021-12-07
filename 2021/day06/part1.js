const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let fish

lineReader.on('line', function (line) {
  fish = line.split(',').map(toDecimal)
})

lineReader.on('close', function () {
  for (var i = 0; i < 80; i++) {
    const newFish = []
    fish.forEach(f => {
      if (f == 0) {
        f = 6
        newFish.push(8)
      } else {
        f--
      }
      newFish.push(f)
    })
    fish = newFish
  }

  console.log(fish.length)
})
