var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

function eq(a, b) {
  return a.x == bx && a.x1 == b.x1 && a.y == by && a.y1 == b.y1 && a.z == bz && a.z1 == b.z1
}

function intersection(a, b) {
  const left = a.x < b.x ? a : b
  const right = left == a ? b : a
  const bottom = a.y < b.y ? a : b
  const top = bottom == a ? b : a
  const near = a.z < b.z ? a : b
  const far = near == a ? b : a

  return {
    x: Math.min(left.x1, right.x),
    x1: Math.min(left.x1, right.x1),
    y: Math.min(bottom.y1, top.y),
    y1: Math.min(bottom.y1, top.y1),
    z: Math.min(near.z1, far.z),
    z1: Math.min(near.z1, far.z1)
  }
}

function substraction(a, b) {
  const intersectionAB = intersection(a, b)
  if (size(intersectionAB)) {
    // console.log('substraction', a, '\n', b, '\n', intersectionAB)
    const result = []

    const xCutLeft = intersectionAB.x
    const xCutRight = intersectionAB.x1
    const yCutBottom = intersectionAB.y
    const yCutTop = intersectionAB.y1
    const zCutNear = intersectionAB.z
    const zCutFar = intersectionAB.z1

    let left
    let right
    let bottom
    let top
    let near
    let far

    if (a.x < xCutLeft) {
      left = slice(a, 'x', xCutLeft)[0]
      result.push(left)
    }

    if (a.x1 > xCutRight) {
      right = slice(a, 'x', xCutRight)[1]
      result.push(right)
    }

    if (a.y < yCutBottom) {
      bottom = slice(a, 'y', yCutBottom)[0]
      if (left) {
        bottom = slice(bottom, 'x', xCutLeft)[1]
      }
      if (right) {
        bottom = slice(bottom, 'x', xCutRight)[0]
      }
      result.push(bottom)
    }
    if (a.y1 > yCutTop) {
      top = slice(a, 'y', yCutTop)[1]
      if (left) {
        top = slice(top, 'x', xCutLeft)[1]
      }
      if (right) {
        top = slice(top, 'x', xCutRight)[0]
      }
      result.push(top)
    }

    if (a.z < zCutNear) {
      near = slice(a, 'z', zCutNear)[0]
      if (left) {
        near = slice(near, 'x', xCutLeft)[1]
      }
      if (right) {
        near = slice(near, 'x', xCutRight)[0]
      }
      if (bottom) {
        near = slice(near, 'y', yCutBottom)[1]
      }
      if (top) {
        near = slice(near, 'y', yCutTop)[0]
      }
      result.push(near)
    }
    if (a.z1 > zCutFar) {
      far = slice(a, 'z', zCutFar)[1]
      if (left) {
        far = slice(far, 'x', xCutLeft)[1]
      }
      if (right) {
        far = slice(far, 'x', xCutRight)[0]
      }
      if (bottom) {
        far = slice(far, 'y', yCutBottom)[1]
      }
      if (top) {
        far = slice(far, 'y', yCutTop)[0]
      }
      result.push(far)
    }
    return result
  } else {
    return [a]
  }
}

function slice(cube, coord, value) {
  if (cube[coord] >= value || cube[`${coord}1`] <= value) {
    return [cube]
  }
  const a = {
    ...cube
  }
  a[`${coord}1`] = value
  const b = {
    ...cube
  }
  b[coord] = value
  return [a, b]
}

function size(cube) {
  return Math.abs(cube.x1 - cube.x) * Math.abs(cube.y1 - cube.y) * Math.abs(cube.z1 - cube.z)
}

let onCubes = []

// substraction(
//   { x: -46, x1: -22, y: -6, y1: 47, z: -50, z1: 0 },
//   { x: -48, x1: -31, y: 26, y1: 42, z: -47, z1: -36 }
// )
// process.exit(1)

lineReader.on('line', function (line) {
  let [_, mode, x, x1, y, y1, z, z1] =
    /(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/.exec(line)
  x = parseInt(x, 10)
  x1 = parseInt(x1, 10) + 1
  y = parseInt(y, 10)
  y1 = parseInt(y1, 10) + 1
  z = parseInt(z, 10)
  z1 = parseInt(z1, 10) + 1
  const countBefore = onCubes.reduce((acc, cube) => acc + size(cube), 0)
  const currentCube = { x, x1, y, y1, z, z1 }
  if (!onCubes.length) {
    onCubes = [currentCube]
    // console.log(
    //   countBefore,
    //   '+',
    //   onCubes.reduce((acc, cube) => acc + size(cube), 0),
    //   '-',
    //   0,
    //   '=',
    //   onCubes.reduce((acc, cube) => acc + size(cube), 0)
    // )
    return
  }
  const newCubes = []
  let substracted = 0
  let added = 0

  if (mode == 'on') {
    // Substract existing cubes from new one so intersections won't be added
    const currentCubes = onCubes.reduce(
      (acc, existingCube) => {
        return acc
          .map(processedCurrentCube => substraction(processedCurrentCube, existingCube))
          .flat()
      },
      [currentCube]
    )
    added = currentCubes.reduce((acc, cube) => acc + size(cube), 0)
    onCubes.push(currentCubes)
  } else {
    onCubes = onCubes.map(cube => {
      substracted += size(intersection(cube, currentCube))
      const substractedSize = size(intersection(cube, currentCube))
      const sizeBefore = size(cube)
      const sizeAfter = substraction(cube, currentCube).reduce((acc, cube) => acc + size(cube), 0)
      if (sizeAfter != sizeBefore - substractedSize) {
        console.log('substracted wrong', sizeBefore, substractedSize, sizeAfter, cube, currentCube)
        process.exit(1)
      }
      return substraction(cube, currentCube)
    })
  }
  onCubes = onCubes.flat()
  // console.log(
  //   countBefore,
  //   '+',
  //   added,
  //   '-',
  //   substracted,
  //   '=',
  //   onCubes.reduce((acc, cube) => acc + size(cube), 0)
  // )
})

lineReader.on('close', function () {
  console.log(onCubes.reduce((acc, cube) => acc + size(cube), 0))
})
