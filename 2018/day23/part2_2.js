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
  input: require('fs').createReadStream(__dirname + '/test2')
})

const bots = []
const zero = { x: 0, y: 0, z: 0 }

function intersects(a, b) {
  const left = a.x < b.x ? a : b
  const right = left == a ? b : a
  const bottom = a.y < b.y ? a : b
  const top = bottom == a ? b : a
  const near = a.z < b.z ? a : b
  const far = near == a ? b : a
  return (
    right.x < left.x + left.width && top.y < bottom.y + bottom.height && far.z < near.z + near.depth
  )
}

function intersection(a, b) {
  const left = a.x < b.x ? a : b
  const right = left == a ? b : a
  const bottom = a.y < b.y ? a : b
  const top = bottom == a ? b : a
  const near = a.z < b.z ? a : b
  const far = near == a ? b : a
  return {
    x: right.x,
    y: top.y,
    z: far.z,
    width: Math.min(left.x + left.width - right.x, right.width),
    height: Math.min(bottom.y + bottom.height - top.y, top.height),
    depth: Math.min(near.z + near.depth - far.z, far.depth)
  }
}

function botToVolume(bot) {
  return {
    x: bot.x - bot.r,
    y: bot.y - bot.r,
    z: bot.z - bot.r,
    width: bot.r * 2,
    height: bot.r * 2,
    depth: bot.r * 2
  }
}

lineReader.on('line', function (line) {
  const [_, x, y, z, r] = /pos=<(\-?\d+),(\-?\d+),(\-?\d+)>, r=(\d+)/.exec(line)
  bots.push({ x: parseInt(x, 10), y: parseInt(y, 10), z: parseInt(z, 10), r: parseInt(r, 10) })
})

lineReader.on('close', function () {
  const sortedBySize = bots.slice().sort((a, b) => b.r - a.r)
  console.log(sortedBySize)
  let volume = {
    x: -Number.MAX_VALUE / 2,
    y: -Number.MAX_VALUE / 2,
    z: -Number.MAX_VALUE / 2,
    width: Number.MAX_VALUE,
    height: Number.MAX_VALUE,
    depth: Number.MAX_VALUE
  }
  let count = 0
  while (sortedBySize.length) {
    const next = botToVolume(sortedBySize.shift())
    if (intersects(volume, next)) {
      count++
      volume = intersection(volume, next)
    } else {
      console.log(next)
    }
  }
  console.log(volume, count)
})
