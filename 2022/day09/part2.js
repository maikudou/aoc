var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const positions = new Set(['0|0'])
let currentPosition = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0]
]
function chase(h, t) {
  if (Math.abs(h[0] - t[0]) > 1 || Math.abs(h[1] - t[1]) > 1) {
    if (Math.abs(h[0] - t[0]) > Math.abs(h[1] - t[1])) {
      t[1] = h[1]
    } else if (Math.abs(h[0] - t[0]) < Math.abs(h[1] - t[1])) {
      t[0] = h[0]
    }
    if (h[0] === t[0]) {
      t[1] = t[1] + (h[1] - t[1] + (h[1] > t[1] ? -1 : 1))
    } else if (h[1] === t[1]) {
      t[0] = t[0] + (h[0] - t[0] + (h[0] > t[0] ? -1 : 1))
    } else {
      t[1] = t[1] + (h[1] - t[1] + (h[1] > t[1] ? -1 : 1))
      t[0] = t[0] + (h[0] - t[0] + (h[0] > t[0] ? -1 : 1))
    }
  }
  return t
}

lineReader.on('line', function (line) {
  let [_, direction, count] = /(\S) (\d+)/.exec(line)
  count = parseInt(count, 10)
  for (let j = 0; j < count; j++) {
    switch (direction) {
      case 'R':
        currentPosition[0][0]++
        for (let i = 1; i < 10; i++) {
          currentPosition[i] = chase(currentPosition[i - 1], currentPosition[i])
        }
        break
      case 'L':
        currentPosition[0][0]--
        for (let i = 1; i < 10; i++) {
          currentPosition[i] = chase(currentPosition[i - 1], currentPosition[i])
        }
        break
      case 'U':
        currentPosition[0][1]++
        for (let i = 1; i < 10; i++) {
          currentPosition[i] = chase(currentPosition[i - 1], currentPosition[i])
        }
        break
      case 'D':
        currentPosition[0][1]--
        for (let i = 1; i < 10; i++) {
          currentPosition[i] = chase(currentPosition[i - 1], currentPosition[i])
        }
        break
    }

    positions.add(`${currentPosition[9][0]}|${currentPosition[9][1]}`)
  }
})

lineReader.on('close', function () {
  console.log(positions.size)
})
