var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/test')
})

let startTime
let busses

lineReader.on('line', function (line) {
  if (!startTime) {
    startTime = parseInt(line, 10)
  } else {
    busses = line.split(',').reduce((acc, value) => {
      if (value != 'x') {
        acc.push(parseInt(value, 10))
      } else {
        acc.push('x')
      }
      return acc
    }, [])
  }
})

lineReader.on('close', function () {
  let timestamp = 0
  let iterations = 0
  let smallIterations = 0
  while (true) {
    iterations++
    let prevTo = -1
    let i = 0
    for (i = 0; i < busses.length; i++) {
      const bus = busses[i]
      if (bus == 'x') {
        prevTo++
      } else {
        let timeSince = timestamp % bus
        let timeTo = timeSince == 0 ? 0 : bus - timeSince
        if (timeTo == prevTo + 1) {
          prevTo++
        } else if (timeTo > prevTo + 1) {
          while (timeTo != prevTo + 1) {
            smallIterations++
            timestamp += busses[0]
            timeSince = timestamp % bus
            timeTo = timeSince == 0 ? 0 : bus - timeSince
          }
          timestamp -= busses[0]
          break
        } else {
          break
        }
      }
    }
    if (i == busses.length) {
      break
    }
    timestamp += busses[0]
  }
  console.log(timestamp, iterations, smallIterations)
})
