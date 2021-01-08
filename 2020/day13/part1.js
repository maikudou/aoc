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
      }
      return acc
    }, [])
  }
})

lineReader.on('close', function () {
  let busNum = null
  let closest = Infinity
  busses.map(bus => {
    const timeSince = startTime % bus
    const timeTo = timeSince == 0 ? 0 : bus - timeSince
    if (timeTo < closest) {
      busNum = bus
      closest = timeTo
    }
    return timeTo
  })
  console.log(busNum * closest)
})
