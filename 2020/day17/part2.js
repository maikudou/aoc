var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

function createPlane() {
  const xs = new Map()
  const ys = new Map()
  return ys.set(0, xs)
}

function createSubSpace() {
  zs = new Map()
  return zs.set(0, createPlane())
}

const mins = {
  x: Infinity,
  y: Infinity,
  z: Infinity,
  w: Infinity
}

const maxs = {
  x: -Infinity,
  y: -Infinity,
  z: -Infinity,
  w: -Infinity
}

function setOrCreate(space, x, y, z, w, state) {
  if (!space.has(w)) {
    space.set(w, createSubSpace())
  }
  const subSpace = space.get(w)
  if (!subSpace.has(z)) {
    subSpace.set(z, createPlane())
  }
  const plane = subSpace.get(z)
  if (!plane.has(y)) {
    plane.set(y, new Map())
  }
  const row = plane.get(y)
  state ? row.set(x, state) : row.delete(x)

  mins.x = Math.min(mins.x, x)
  mins.y = Math.min(mins.y, y)
  mins.z = Math.min(mins.z, z)
  mins.w = Math.min(mins.w, w)

  maxs.x = Math.max(maxs.x, x)
  maxs.y = Math.max(maxs.y, y)
  maxs.z = Math.max(maxs.z, z)
  maxs.w = Math.max(maxs.w, w)
}

let space = new Map()

function neigboursCountOf(space, x, y, z, w) {
  let count = 0
  ;[-1, 0, 1].map(wd => {
    const subSpace = space.get(w - wd)
    if (subSpace) {
      ;[-1, 0, 1].map(zd => {
        const plane = subSpace.get(z - zd)
        if (plane) {
          ;[-1, 0, 1].map(yd => {
            const row = plane.get(y - yd)
            if (row) {
              ;[-1, 0, 1].map(xd => {
                if (xd || yd || zd || wd) {
                  count += row.has(x + xd) ? 1 : 0
                }
              })
            }
          })
        }
      })
    }
  })
  return count
}

function stateOf(x, y, z, w) {
  const subSpace = space.get(w)
  if (subSpace) {
    const plane = subSpace.get(z)
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
  } else {
    return false
  }
}

function checkStates() {
  const localMins = Object.assign({}, mins)
  const localMaxs = Object.assign({}, maxs)
  const nextSpace = new Map()
  for (var wi = localMins.w - 1; wi <= localMaxs.w + 1; wi++) {
    for (var zi = localMins.z - 1; zi <= localMaxs.z + 1; zi++) {
      for (var yi = localMins.y - 1; yi <= localMaxs.y + 1; yi++) {
        for (var xi = localMins.x - 1; xi <= localMaxs.x + 1; xi++) {
          const neigboursCount = neigboursCountOf(space, xi, yi, zi, wi)
          if (stateOf(xi, yi, zi, wi)) {
            if (neigboursCount == 2 || neigboursCount == 3) {
              setOrCreate(nextSpace, xi, yi, zi, wi, true)
            } else {
              setOrCreate(nextSpace, xi, yi, zi, wi, false)
            }
          } else {
            neigboursCount === 3 && setOrCreate(nextSpace, xi, yi, zi, wi, true)
          }
        }
      }
    }
  }
  return nextSpace
}

function count(space) {
  return Array.from(space.values()).reduce((acc, subSpace) => {
    return (
      acc +
      Array.from(subSpace.values()).reduce((acc, plane) => {
        return (
          acc +
          Array.from(plane.values()).reduce((acc, row) => {
            return acc + row.size
          }, 0)
        )
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
      setOrCreate(space, x, y, 0, 0, true)
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
