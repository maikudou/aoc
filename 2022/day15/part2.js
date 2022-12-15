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
  const max = 4000000
  const sensorsArray = Array.from(sensors.values())

  for (let y = 0; y <= max; y++) {
    const lines = sensorsArray
      .filter(({ position, radius }) => manhattanDistance(position, { x: position.x, y }) <= radius)
      .map(({ position, radius }, value) => [
        position.x - radius + Math.abs(position.y - y),
        position.x + radius - Math.abs(position.y - y)
      ])
      .sort((a, b) => a[0] - b[0])
      .reduce((acc, value) => {
        const lastLine = acc.pop()
        if (lastLine) {
          if (value[0] <= lastLine[1] + 1) {
            acc.push([Math.min(lastLine[0], value[0]), Math.max(lastLine[1], value[1])])
            return acc
          } else {
            return acc.concat([lastLine], [value])
          }
        } else {
          return [value]
        }
      }, [])
    if (lines.length === 2) {
      console.log((lines[0][1] + 1) * 4000000 + y)
      break
    }
  }
})
