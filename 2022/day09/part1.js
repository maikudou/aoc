var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const positions = new Set(['0|0'])
let currentHPosition = [0, 0]
let currentTPosition = [0, 0]

lineReader.on('line', function (line) {
  let [_, direction, count] = /(\S) (\d+)/.exec(line)
  count = parseInt(count, 10)
  for (let i = 0; i < count; i++) {
    switch (direction) {
      case 'R':
        currentHPosition[0]++
        if (Math.abs(currentTPosition[0] - currentHPosition[0]) > 1) {
          currentTPosition[0] = currentHPosition[0] - 1
          currentTPosition[1] = currentHPosition[1]
        }
        break
      case 'L':
        currentHPosition[0]--
        if (Math.abs(currentTPosition[0] - currentHPosition[0]) > 1) {
          currentTPosition[0] = currentHPosition[0] + 1
          currentTPosition[1] = currentHPosition[1]
        }
        break
      case 'U':
        currentHPosition[1]++
        if (Math.abs(currentTPosition[1] - currentHPosition[1]) > 1) {
          currentTPosition[1] = currentHPosition[1] - 1
          currentTPosition[0] = currentHPosition[0]
        }
        break
      case 'D':
        currentHPosition[1]--
        if (Math.abs(currentTPosition[1] - currentHPosition[1]) > 1) {
          currentTPosition[1] = currentHPosition[1] + 1
          currentTPosition[0] = currentHPosition[0]
        }
        break
    }
    positions.add(`${currentTPosition[0]}|${currentTPosition[1]}`)
  }
})

lineReader.on('close', function () {
  console.log(positions.size)
})
