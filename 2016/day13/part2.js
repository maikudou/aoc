const favNum = 1358
const target = { x: 31, y: 39 }

function getCell(x, y) {
  const result = (x * x + 3 * x + 2 * x * y + y + y * y + favNum).toString(2)
  return (
    result.split('').reduce(function (acc, value) {
      return acc + parseInt(value, 10)
    }, 0) % 2
  )
}

const distances = new Map()

var queue = [{ x: 1, y: 1 }]
distances.set('1|1', 0)

var found = false
var currentCell

var cursorPosition = {
  x: 0,
  y: 47
}

var locations = 0

while (queue.length && !found) {
  currentCell = queue.shift()
  var xVariants = [currentCell.x + 1]
  var yVariants = [currentCell.y + 1]
  var distance = distances.get(`${currentCell.x}|${currentCell.y}`)
  if (distance <= 50) {
    locations++
  } else {
    console.log(locations)
    process.exit(0)
  }

  if (currentCell.x > 0) {
    xVariants.unshift(currentCell.x - 1)
  }
  if (currentCell.y > 0) {
    yVariants.unshift(currentCell.y - 1)
  }
  const nextCells = []

  for (var i = 0; i < xVariants.length; i++) {
    var x = xVariants[i]
    var y = currentCell.y

    if (x === target.x && y === target.y) {
      found = true
    }
    if (!distances.has(`${x}|${y}`) && !getCell(x, y)) {
      // console.log('push', { x, y });
      nextCells.push({ x, y })
      distances.set(`${x}|${y}`, distance + 1)
    }
  }
  for (var j = 0; j < yVariants.length; j++) {
    var x = currentCell.x
    var y = yVariants[j]

    if (x === target.x && y === target.y) {
      found = true
    }
    if (!distances.has(`${x}|${y}`) && !getCell(x, y)) {
      nextCells.push({ x, y })
      distances.set(`${x}|${y}`, distance + 1)
    }
  }
  queue = queue.concat(nextCells)
}
