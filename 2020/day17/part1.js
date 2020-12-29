var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

function createPlane() {
  const xs = new Map()
  const ys = new Map()
  return ys.set(0, xs)
}

const mins = {
  x: Infinity,
  y: Infinity,
  z: Infinity
}

const maxs = {
  x: -Infinity,
  y: -Infinity,
  z: -Infinity
}

function setOrCreate(space, x, y, z, state) {
  if (!space.has(z)) {
    space.set(z, createPlane())
  }
  const plane = space.get(z)
  if (!plane.has(y)) {
    plane.set(y, new Map())
  }
  const row = plane.get(y)
  state ? row.set(x, state) : row.delete(x)

  mins.x = Math.min(mins.x, x)
  mins.y = Math.min(mins.y, y)
  mins.z = Math.min(mins.z, z)

  maxs.x = Math.max(maxs.x, x)
  maxs.y = Math.max(maxs.y, y)
  maxs.z = Math.max(maxs.z, z)
}

// space is a map if xy planes distributed other z axis
let space = new Map()

function neigboursCountOf(space, x, y, z) {
  let count = 0
  ;[-1, 0, 1].map(zd => {
    const plane = space.get(z - zd)
    if (plane) {
      ;[-1, 0, 1].map(yd => {
        const row = plane.get(y - yd)
        if (row) {
          ;[-1, 0, 1].map(xd => {
            if (xd || yd || zd) {
              count += row.has(x + xd) ? 1 : 0
            }
          })
        }
      })
    }
  })
  return count
}

function stateOf(x, y, z) {
  const plane = space.get(z)
  if (plane) {
    const row = plane.get(y)
    if (row) {
      return row.has(x)
    } else {
      return false
    }
  } else {
    return false
  }
}

function checkStates() {
  const localMins = Object.assign({}, mins)
  const localMaxs = Object.assign({}, maxs)
  const nextSpace = new Map()
  for (var zi = localMins.z - 1; zi <= localMaxs.z + 1; zi++) {
    for (var yi = localMins.y - 1; yi <= localMaxs.y + 1; yi++) {
      for (var xi = localMins.x - 1; xi <= localMaxs.x + 1; xi++) {
        const neigboursCount = neigboursCountOf(space, xi, yi, zi)
        if (stateOf(xi, yi, zi)) {
          if (neigboursCount == 2 || neigboursCount == 3) {
            setOrCreate(nextSpace, xi, yi, zi, true)
          } else {
            setOrCreate(nextSpace, xi, yi, zi, false)
          }
        } else {
          neigboursCount === 3 && setOrCreate(nextSpace, xi, yi, zi, true)
        }
      }
    }
  }
  return nextSpace
}

function count(space) {
  return Array.from(space.values()).reduce((acc, plane) => {
    return (
      acc +
      Array.from(plane.values()).reduce((acc, row) => {
        return acc + row.size
      }, 0)
    )
  }, 0)
}

let y = 0

lineReader.on('line', function (line) {
  const states = line.split('')
  let x = 0
  states.map(state => {
    if (state === '#') {
      setOrCreate(space, x, y, 0, true)
    }
    x++
  })
  y++
})

lineReader.on('close', function () {
  space = checkStates()
  space = checkStates()
  space = checkStates()
  space = checkStates()
  space = checkStates()
  space = checkStates()
  console.log(count(space))
})
