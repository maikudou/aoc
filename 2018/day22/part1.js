const depth = 9465
const targetX = 13
const targetY = 704

const levels = new Map()

function getLevel(x, y) {
  if (levels.has(`${x}|${y}`)) {
    return levels.get(`${x}|${y}`)
  }
  let index
  if ((x == 0 && y == 0) || (x == targetX && y == targetY)) {
    index = 0
  } else if (x == 0) {
    index = y * 48271
  } else if (y == 0) {
    index = x * 16807
  } else {
    index = getLevel(x - 1, y) * getLevel(x, y - 1)
  }
  const level = (index + depth) % 20183
  levels.set(`${x}|${y}`, level)
  return level
}

function getType(x, y) {
  const level = getLevel(x, y)
  const mod = level % 3
  return mod == 0 ? '.' : mod == 1 ? '-' : '|'
}

let riskLevel = 0
for (var i = 0; i <= targetX; i++) {
  for (var j = 0; j <= targetY; j++) {
    const type = getType(i, j)
    riskLevel += type == '-' ? 1 : type == '|' ? 2 : 0
  }
}
console.log(riskLevel)
