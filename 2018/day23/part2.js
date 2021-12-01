const manhattanDistance = require('../../utils/manhattanDistance')
const { Heap } = require('../../utils/Heap')

class MinXHeap extends Heap {
  _compare(a, b) {
    return a.x + a.r < b.x + b.r
  }
}

class MinYHeap extends Heap {
  _compare(a, b) {
    return a.y + a.r < b.y + b.r
  }
}

class MinZHeap extends Heap {
  _compare(a, b) {
    return a.z + a.r < b.z + b.r
  }
}

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const bots = []
const zero = { x: 0, y: 0, z: 0 }

lineReader.on('line', function (line) {
  const [_, x, y, z, r] = /pos=<(\-?\d+),(\-?\d+),(\-?\d+)>, r=(\d+)/.exec(line)
  bots.push({ x: parseInt(x, 10), y: parseInt(y, 10), z: parseInt(z, 10), r: parseInt(r, 10) })
})

lineReader.on('close', function () {
  const sortedXBots = bots.slice().sort((a, b) => a.x - a.r - (b.x - b.r))
  const sortedYBots = bots.slice().sort((a, b) => a.y - a.r - (b.y - b.r))
  const sortedZBots = bots.slice().sort((a, b) => a.z - a.r - (b.z - b.r))

  let maxXResult = []
  let maxYResult = []
  let maxZResult = []

  const { minX, maxX, minY, maxY, minZ, maxZ } = bots.reduce(
    (acc, bot) => ({
      minX: Math.min(acc.minX, bot.x - bot.r),
      maxX: Math.max(acc.maxX, bot.x + bot.r),
      minY: Math.min(acc.minY, bot.y - bot.r),
      maxY: Math.max(acc.maxY, bot.y + bot.r),
      minZ: Math.min(acc.minZ, bot.z - bot.r),
      maxZ: Math.max(acc.maxZ, bot.z + bot.r)
    }),
    {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
      minZ: Infinity,
      maxZ: -Infinity
    }
  )

  const XHeap = new MinXHeap()
  const YHeap = new MinYHeap()
  const ZHeap = new MinXHeap()

  for (let x = minX; x <= maxX; x++) {
    while (sortedXBots.length && sortedXBots[0].x - sortedXBots[0].r == x) {
      XHeap.insert(sortedXBots.shift())
    }
    while (XHeap.length && XHeap.getTop().x + XHeap.getTop().r < x) {
      XHeap.pop()
    }

    let nextX = x
    if (sortedXBots.length || XHeap.length) {
      nextX = Math.max(
        x,
        Math.min(
          sortedXBots.length ? sortedXBots[0].x - sortedXBots[0].r : Infinity,
          XHeap.length ? XHeap.getTop().x + XHeap.getTop().r : Infinity
        ) - 1
      )
    }
    if (maxXResult.length == 0) {
      maxXResult.push({
        start: x,
        end: nextX,
        count: XHeap.length
      })
    } else {
      if (maxXResult[0].count < XHeap.length) {
        maxXResult = [
          {
            start: x,
            end: nextX,
            count: XHeap.length
          }
        ]
      } else if (maxXResult[0].count == XHeap.length) {
        if (maxXResult[maxXResult.length - 1].end === x - 1) {
          maxXResult[maxXResult.length - 1].end = nextX
        } else {
          maxXResult.push({
            start: x,
            end: nextX,
            count: XHeap.length
          })
        }
      }
    }
    x = nextX
  }
  console.log('x', maxXResult)

  for (let y = minY; y <= maxY; y++) {
    while (sortedYBots.length && sortedYBots[0].y - sortedYBots[0].r == y) {
      YHeap.insert(sortedYBots.shift())
    }
    while (YHeap.length && YHeap.getTop().y + YHeap.getTop().r < y) {
      YHeap.pop()
    }
    let nextY = y
    if (sortedYBots.length || YHeap.length) {
      nextY = Math.max(
        y,
        Math.min(
          sortedYBots.length ? sortedYBots[0].y - sortedYBots[0].r : Infinity,
          YHeap.length ? YHeap.getTop().y + YHeap.getTop().r : Infinity
        ) - 1
      )
    }

    if (maxYResult.length == 0) {
      maxYResult.push({
        start: y,
        end: nextY,
        count: YHeap.length
      })
    } else {
      if (maxYResult[0].count < YHeap.length) {
        maxYResult = [
          {
            start: y,
            end: nextY,
            count: YHeap.length
          }
        ]
      } else if (maxYResult[0].count == YHeap.length) {
        if (maxYResult[maxYResult.length - 1].end === y - 1) {
          maxYResult[maxYResult.length - 1].end = nextY
        } else {
          maxYResult.push({
            start: y,
            end: nextY,
            count: YHeap.length
          })
        }
      }
    }

    y = nextY
  }
  console.log('y', maxYResult)

  for (let z = minZ; z <= maxZ; z++) {
    while (sortedZBots.length && sortedZBots[0].z - sortedZBots[0].r == z) {
      ZHeap.insert(sortedZBots.shift())
    }
    while (ZHeap.length && ZHeap.getTop().z + ZHeap.getTop().r < z) {
      ZHeap.pop()
    }
    let nextX = z
    if (sortedZBots.length || ZHeap.length) {
      nextZ = Math.max(
        z,
        Math.min(
          sortedZBots.length ? sortedZBots[0].z - sortedZBots[0].r : Infinity,
          ZHeap.length ? ZHeap.getTop().z + ZHeap.getTop().r : Infinity
        ) - 1
      )
    }

    if (maxZResult.length == 0) {
      maxZResult.push({
        start: z,
        end: nextZ,
        count: ZHeap.length
      })
    } else {
      if (maxZResult[0].count < ZHeap.length) {
        maxZResult = [
          {
            start: z,
            end: nextZ,
            count: ZHeap.length
          }
        ]
      } else if (maxZResult[0].count == ZHeap.length) {
        if (maxZResult[maxZResult.length - 1].end === z - 1) {
          maxZResult[maxZResult.length - 1].end = nextZ
        } else {
          maxZResult.push({
            start: z,
            end: nextZ,
            count: ZHeap.length
          })
        }
      }
    }
    z = nextZ
  }
  console.log('z', maxZResult)
  for (let x = maxXResult[0].start; x <= maxXResult[0].end; x++) {
    for (let y = maxYResult[0].start; y <= maxYResult[0].end; y++) {
      for (let z = maxZResult[0].start; z <= maxZResult[0].end; z++) {
        const count = bots.reduce((acc, value) => {
          return acc + (manhattanDistance(value, { x, y, z }) <= value.r ? 1 : 0)
        }, 0)
        // console.log(x, y, z, manhattanDistance(zero, { x, y, z }), count)
      }
    }
  }
})
