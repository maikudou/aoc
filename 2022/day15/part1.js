const toDecimal = require('../../utils/toDecimal')
const manhattanDistance = require('../../utils/manhattanDistance')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const sensors = new Map()
const beacons = new Set()

lineReader.on('line', function (line) {
  const [sX, sY, bX, bY] =
    /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/
      .exec(line)
      .slice(1, 5)
      .map(toDecimal)

  sensors.set(`${sX}|${sY}`, {
    position: { x: sX, y: sY },
    radius: Math.abs(bX - sX) + Math.abs(bY - sY)
  })
  beacons.add(`${bX}|${bY}`)
})

lineReader.on('close', function () {
  const lineY = 2000000
  const a = Array.from(sensors.values())
    .filter(
      ({ position, radius }) => manhattanDistance(position, { x: position.x, y: lineY }) <= radius
    )
    .map(({ position, radius }, value) => [
      position.x - radius + Math.abs(position.y - lineY),
      position.x + radius - Math.abs(position.y - lineY)
    ])
    .sort((a, b) => a[0] - b[0])
    .reduce((acc, value) => {
      const lastLine = acc.pop()
      if (lastLine) {
        if (value[0] <= lastLine[1]) {
          acc.push([Math.min(lastLine[0], value[0]), Math.max(lastLine[1], value[1])])
          return acc
        } else {
          return acc.concat([lastLine], [value])
        }
      } else {
        return [value]
      }
    }, [])
    .reduce((acc, value) => acc + (value[1] - value[0]), 0)

  console.log(a)
})
