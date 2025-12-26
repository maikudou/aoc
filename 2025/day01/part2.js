var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let current = 50
let zeroCount = 0

function getClicks(current, rotation) {
  const count = Math.abs(rotation)
  const fullRevs = Math.floor(count / 100)
  const remainder = count % 100
  let zeroClicks = 0

  if (rotation > 0) {
    if (current < 0) {
      if (Math.abs(current) < remainder) {
        zeroClicks++
      }
    } else if (current + remainder > 100) {
      zeroClicks++
    }
  } else {
    if (current > 0) {
      if (current < remainder) {
        zeroClicks++
      }
    } else if (current - remainder < -100) {
      zeroClicks++
    }
  }

  const newCurrent = (current + rotation) % 100

  return (newCurrent ? 0 : remainder ? 1 : 0) + fullRevs + zeroClicks
}

lineReader.on('line', function (line) {
  const [_, dir, c] = /(\w)(\d+)/.exec(line)
  const count = parseInt(c, 10)
  zeroCount += getClicks(current, (dir === 'L' ? -1 : 1) * count)
  current = (current + (dir === 'L' ? -1 : 1) * count) % 100
})

lineReader.on('close', function () {
  console.log(zeroCount)
})
