var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const cubes = new Set()

lineReader.on('line', function (line) {
  let [_, mode, x, x1, y, y1, z, z1] =
    /(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/.exec(line)

  x = parseInt(x, 10)
  x1 = parseInt(x1, 10)
  y = parseInt(y, 10)
  y1 = parseInt(y1, 10)
  z = parseInt(z, 10)
  z1 = parseInt(z1, 10)

  if (
    x > 50 ||
    x < -50 ||
    x1 > 50 ||
    x1 < -50 ||
    y > 50 ||
    y < -50 ||
    y1 > 50 ||
    y1 < -50 ||
    z > 50 ||
    z < -50 ||
    z1 > 50 ||
    z1 < -50
  ) {
    return
  }

  for (let i = x; i <= x1; i++) {
    for (let j = y; j <= y1; j++) {
      for (let k = z; k <= z1; k++) {
        if (mode === 'on') {
          cubes.add(`${i}|${j}|${k}`)
        } else {
          cubes.delete(`${i}|${j}|${k}`)
        }
      }
    }
  }
})

lineReader.on('close', function () {
  console.log(cubes.size)
})
