const { Heap } = require('../../utils/Heap')

class MinHeap extends Heap {
  _compare(a, b) {
    return a.distTo < b.distTo
  }
}

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
  return mod == 0 ? '.' : mod == 1 ? '=' : '|'
}

let riskLevel = 0
for (var i = 0; i <= targetX; i++) {
  for (var j = 0; j <= targetY; j++) {
    const type = getType(i, j)
    riskLevel += type == '=' ? 1 : type == '|' ? 2 : 0
  }
}

let target

const equippable = {
  '.': ['climbing gear', 'torch'],
  '=': ['climbing gear', 'neither'],
  '|': ['torch', 'neither']
}

function dijkstra(x, y, x1, y1, equipped) {
  if (x == x1 && y == y1) {
    return 0
  }

  let current = {
    x,
    y,
    type: getType(x, y),
    distTo: 0,
    equipped
  }
  const visited = new Set()
  localMap = new Map()

  let heap = new MinHeap()

  while (current) {
    if (visited.has(`${current.x}|${current.y}|${current.equipped}`)) {
      current = heap.pop()
      continue
    }
    // console.log('current', current)
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          (i || j) &&
          Math.abs(i) != Math.abs(j) &&
          current.x + i > -1 &&
          current.y + j > -1 &&
          current.x + i < x1 + 10 &&
          current.y + j < y1 + 10
        ) {
          // console.log(current.x + i, current.y + j)
          const neihgbourType = getType(current.x + i, current.y + j)

          const currentEquippable = equippable[current.type]
          const neihgbourEquippable = equippable[neihgbourType].reduce((acc, value) => {
            if (currentEquippable.indexOf(value) > -1) {
              acc.push(value)
            }
            return acc
          }, [])

          neihgbourEquippable.forEach(equippable => {
            const neihgbour = localMap.get(`${current.x + i}|${current.y + j}|${equippable}`) || {
              x: current.x + i,
              y: current.y + j,
              type: neihgbourType,
              distTo: Infinity,
              equipped: equippable
            }

            neihgbour.distTo = Math.min(
              neihgbour.distTo,
              current.distTo + (current.equipped === neihgbour.equipped ? 1 : 8)
            )
            // console.log(neihgbour)

            localMap.set(`${neihgbour.x}|${neihgbour.y}|${neihgbour.equipped}`, neihgbour)

            heap.insert(neihgbour)
          })
        }
      }
    }

    visited.add(`${current.x}|${current.y}|${current.equipped}`)

    if (current.x == x1 && current.y == y1) {
      if (target) {
        if (
          target.distTo + (target.equipped == 'torch' ? 0 : 7) >
          current.distTo + (current.equipped == 'torch' ? 0 : 7)
        ) {
          // console.log('existing is worse', target, current)
          target = current
        }
      } else {
        // console.log('new one', current)
        target = current
      }
    }
    current = heap.pop()
  }
}

dijkstra(0, 0, targetX, targetY, 'torch')

console.log(target.distTo + (target.equipped == 'torch' ? 0 : 7))
