var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

function inTarget(x, y, x1, x2, y1, y2) {
  return x >= x1 && x <= x2 && y >= y1 && y <= y2
}

function overThrown(x, y, x1, x2, y1, y2) {
  return x > x2 || y < y1
}

lineReader.on('line', function (line) {
  let [_, x1, x2, y1, y2] = /target area: x=(\-?\d+)..(\-?\d+), y=(\-?\d+)..(\-?\d+)/.exec(line)
  x1 = parseInt(x1, 10)
  x2 = parseInt(x2, 10)
  y1 = parseInt(y1, 10)
  y2 = parseInt(y2, 10)
  // console.log(x1, x2, y1, y2)
  let localYV = y1
  let localXV = 1

  let count = 0

  while (true) {
    let localHigh = 0
    let x = 0
    let y = 0
    for (let i = 1; i <= x2; i++) {
      x = 0
      y = 0
      localXV = i
      let xV = localXV
      let yV = localYV
      // console.log(localXV, localYV)
      let maxLocalX = 0
      while (!overThrown(x, y, x1, x2, y1, y2) && !inTarget(x, y, x1, x2, y1, y2)) {
        x += xV
        y += yV
        xV += xV == 0 ? 0 : xV > 0 ? -1 : 1
        yV += -1
      }
      if (inTarget(x, y, x1, x2, y1, y2)) {
        count++
        // console.log(localXV, localYV)
      }
    }
    console.log(count)
    localYV++
  }
  console.log(count)
})

lineReader.on('close', function () {})
