const { south, east } = require('../../utils/mapNeigbors')
const { QuickUnion } = require('../../utils/QuickUnion')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let map = []
let width = 0
let regions = new Map()
let id = 0

lineReader.on('line', function (line) {
  width = line.length
  map = map.concat(line.split(''))
})

lineReader.on('close', function () {
  const union = new QuickUnion(map.length)
  map.forEach((id, index) => {
    if (south(map, width, index) === id) {
      union.union(index, index + width)
    }
    if (east(map, width, index) === id) {
      union.union(index, index + 1)
    }
  })
  map.forEach((_, index) => {
    const current = union.root(index)
    if (!regions.has(current)) {
      regions.set(current, { area: 0, perimeter: 0 })
    }
    const region = regions.get(current)
    region.area++
    if (!union.connected(index, index - width)) {
      region.perimeter++
    }
    if (!union.connected(index, index + width)) {
      region.perimeter++
    }
    if (!union.connected(index, index + 1)) {
      region.perimeter++
    }
    if (!union.connected(index, index - 1)) {
      region.perimeter++
    }
  })
  console.log(
    Array.from(regions.values()).reduce((acc, value) => acc + value.area * value.perimeter, 0)
  )
})
