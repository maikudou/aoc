var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var minX = Infinity
var minY = Infinity
var maxX = 0
var maxY = 0
var maxDistance
var maxDistanceSum = 10000

var grid = new Map()

lineReader.on('line', function (line) {
  line = line.split(', ')
  minX = Math.min(minX, line[0])
  minY = Math.min(minY, line[1])
  maxX = Math.max(maxX, line[0])
  maxY = Math.max(maxY, line[1])
  maxDistance = maxY - minY + maxX - minY - 1

  const distances = new Map()
  distances.set(line.join(','), 0)

  grid.set(line.join(','), {
    x: line[0],
    y: line[1],
    distances: distances
  })
})

function fillDistances(node) {
  var initialNodeIndex = `${node.x},${node.y}`
  var initialNodeX = parseInt(node.x)
  var initialNodeY = parseInt(node.y)
  var d = 'r'
  var w = 2
  var xInc = 0
  var yInc = 0
  var x = node.x - 1
  var y = node.y - 1
  var isGood = true
  var nextNodeIndex
  var nextNode
  var changed = false
  var newDistance

  while (isGood) {
    nextNodeIndex = `${x},${y}`

    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      newDistance = Math.abs(x - initialNodeX) + Math.abs(y - initialNodeY)

      if (!grid.has(nextNodeIndex)) {
        distances = new Map()
        distances.set(initialNodeIndex, newDistance)
        grid.set(nextNodeIndex, {
          x: x,
          y: y,
          distances: distances
        })
      } else {
        nextNode = grid.get(nextNodeIndex)

        if (!nextNode.distances.has(initialNodeIndex)) {
          nextNode.distances.set(initialNodeIndex, newDistance)
        }
      }

      changed = true
    }

    switch (d) {
      case 'r':
        if (xInc == w) {
          d = 'd'
        }
        break
      case 'd':
        if (yInc == w) {
          d = 'l'
        }
        break
      case 'l':
        if (xInc == 0) {
          d = 'u'
        }
        break
      case 'u':
        if (yInc == 1) {
          if (!changed) {
            isGood = false
          }
          d = 'r'
          w += 2
          x -= 2
          y -= 2
          xInc = -1
          yInc = 0
          changed = false
        }
        break
    }

    switch (d) {
      case 'r':
        x++
        xInc++
        break
      case 'd':
        y++
        yInc++
        break
      case 'l':
        x--
        xInc--
        break
      case 'u':
        y--
        yInc--
        break
    }
  }
}

lineReader.on('close', function () {
  const gridArray = Array.from(grid.keys())
  var next = gridArray.shift()
  var node = grid.get(next)

  while (next) {
    queue = []
    node = grid.get(next)
    fillDistances(node)

    next = gridArray.shift()
  }

  const initialGridArray = Array.from(grid.keys())

  var regionCount = 0
  var sum

  while (initialGridArray.length) {
    var nextInitialNode = initialGridArray.shift()
    var [x, y] = nextInitialNode.split(',')
    if (x > minX && x < maxX && y > minY && y < maxY) {
      var sum = Array.from(grid.get(nextInitialNode).distances.values()).reduce(function (
        acc,
        next
      ) {
        return (acc += next)
      },
      0)
      if (sum < maxDistanceSum) {
        regionCount++
      }
    }
  }

  console.log(regionCount)
})
