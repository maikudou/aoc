var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const grid = new Map()

lineReader.on('line', function (line) {
  const match = /^\/dev\/grid\/node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T.+$/.exec(line)
  if (match) {
    const [_, x, y, size, used, available] = match
    grid.set(`${x}|${y}`, {
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      size: parseInt(size, 10),
      used: parseInt(used, 10),
      available: parseInt(available, 10)
    })
  }
})

lineReader.on('close', function () {
  const gridArray = Array.from(grid.values())
  const count = gridArray.reduce((acc, value, index, array) => {
    return (
      acc +
      array.reduce((otherAcc, otherValue, otherIndex) => {
        return (
          otherAcc +
          (otherIndex == index
            ? 0
            : value.used == 0
            ? 0
            : otherValue.available >= value.used
            ? 1
            : 0)
        )
      }, 0)
    )
  }, 0)
  console.log(count)
})
