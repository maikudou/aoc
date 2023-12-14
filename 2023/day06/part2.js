const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let times
let distances

lineReader.on('line', function (line) {
  if (!times) {
    times = /\w+: \s+([\d\s]+)$/.exec(line)[1].replace(/\s+/g, '').split(' ').map(toDecimal)
  } else {
    distances = /\w+: \s+([\d\s]+)$/.exec(line)[1].replace(/\s+/g, '').split(' ').map(toDecimal)
  }
})

lineReader.on('close', function () {
  let product = 1
  times.forEach((time, index) => {
    let wins = 0
    let max = 0
    let reachedMax = false
    let distance
    for (let i = 1; i < time; i++) {
      distance = i * (time - i)
      if (distance <= max) {
        reachedMax = true
      }
      max = Math.max(distance, max)
      if (distance > distances[index]) {
        wins++
      }
      if (distance < distances[index] && reachedMax) {
        break
      }
    }
    product = product * wins
  })
  console.log(product)
})
