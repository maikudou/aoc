var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
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
  const bussesWithIdsIndices = busses.reduce((acc, value, index) => {
    if (value != 'x') {
      acc.push(index)
    }
    return acc
  }, [])
  const periods = bussesWithIdsIndices.reduce((acc, value, index, array) => {
    if (acc.length) {
      const indexDiff = value - array[index - 1]
      let timestamp = 0
      let periodStarted
      const prevBus = busses[array[index - 1]]
      const currentBus = busses[value]
      while (true) {
        let timeSince = timestamp % prevBus
        let timeTo = timeSince == 0 ? 0 : prevBus - timeSince

        let timeSinceCurrent = timestamp % currentBus
        let timeToCurrent = timeSinceCurrent == 0 ? 0 : currentBus - timeSinceCurrent

        if (!periodStarted && timeTo == 0 && timeToCurrent == timeTo + indexDiff) {
          periodStarted = timestamp
          timestamp++
          continue
        }
        if (periodStarted && timeTo == 0 && timeToCurrent == timeTo + indexDiff) {
          acc.push([array[index - 1], periodStarted, timestamp - periodStarted])
          break
        }

        timestamp++
      }
    } else {
      acc.push([-1, 0, busses[value]])
    }
    return acc
  }, [])
  periods.shift()
  periods.sort((a, b) => (a[2] < b[2] ? 1 : a[2] == b[2] ? 0 : -1))

  let multiplier = 1
  let ts

  while (true) {
    ts = periods[0][2] * multiplier + periods[0][1] - periods[0][0]
    for (var i = 1; i < periods.length; i++) {
      if ((ts - periods[i][1] + periods[i][0]) % periods[i][2]) {
        break
      }
    }
    if (i == periods.length) {
      break
    }
    multiplier++
  }

  console.log(ts)
})
