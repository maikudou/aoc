var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const map = []

lineReader.on('line', function (line) {
  map.push(
    line.split('').reduce((acc, current) => {
      acc.push(current === '#')
      return acc
    }, [])
  )
})

lineReader.on('close', function () {
  let x1 = 0
  let x2 = 0
  let x3 = 0
  let x4 = 0
  let x5 = 0
  let y1 = 0
  let y2 = 0
  let y3 = 0
  let y4 = 0
  let y5 = 0
  let trees1 = 0
  let trees2 = 0
  let trees3 = 0
  let trees4 = 0
  let trees5 = 0
  const rowsCount = map.length
  const lineLength = map[0].length

  while (y1 < rowsCount || y2 < rowsCount || y3 < rowsCount || y4 < rowsCount || y5 < rowsCount) {
    if (map[y1] && map[y1][x1 % lineLength]) {
      trees1++
    }
    if (map[y2] && map[y2][x2 % lineLength]) {
      trees2++
    }
    if (map[y3] && map[y3][x3 % lineLength]) {
      trees3++
    }
    if (map[y4] && map[y4][x4 % lineLength]) {
      trees4++
    }
    if (map[y5] && map[y5][x5 % lineLength]) {
      trees5++
    }

    x1++
    y1++

    x2 += 3
    y2++

    x3 += 5
    y3++

    x4 += 7
    y4++

    x5++
    y5 += 2
  }
  console.log(trees1 * trees2 * trees3 * trees4 * trees5)
})
