var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/test')
})

const lines = []
const columns = []
let path

lineReader.on('line', function (line) {
  if (/\.|#| /.test(line)) {
    const splitLine = line.split('')
    const newLine = [splitLine.findIndex(v => v !== ' '), splitLine.length - 1]
    splitLine.forEach((value, index) => {
      if (value !== ' ') {
        newLine.push(value)
      }
    })
    lines.push(newLine)
  } else if (line) {
    path = line.split('').reduce((acc, value) => {
      if (isNaN(value)) {
        if (!isNaN(acc[acc.length - 1])) {
          acc[acc.length - 1] = parseInt(acc[acc.length - 1], 10)
        }
        acc.push(value)
      } else {
        if (!isNaN(acc[acc.length - 1])) {
          acc[acc.length - 1] = `${acc[acc.length - 1]}${value}`
        } else {
          acc.push(value)
        }
      }
      return acc
    }, [])
  }
})

lineReader.on('close', function () {
  const maxColumn = lines.reduce((acc, line) => Math.max(acc, line[1]), 0)

  for (let i = 0; i <= maxColumn; i++) {
    const goodLines = lines.filter(line => line[0] <= i && line[1] >= i)
    const newColumn = [lines.findIndex(line => line[0] <= i && line[1] >= i)]
    newColumn[1] = goodLines.length + newColumn[0] - 1

    goodLines.forEach(line => {
      newColumn.push(line[i + 2 - line[0]])
    })
    columns.push(newColumn)
  }

  let x = lines[0][0]
  let y = 0
  let d = 0
  path.forEach(step => {
    if (step === 'R') {
      d++
      if (d > 3) {
        d = 0
      }
    } else if (step === 'L') {
      d--
      if (d < 0) {
        d = 3
      }
    } else {
      switch (d) {
        case 0:
          while (step--) {
            const x2c = x == lines[y][1] ? lines[y][0] : x + 1
            if (lines[y][x2c - lines[y][0] + 2] !== '#') {
              x = x2c
            }
          }
          break
        case 2:
          while (step--) {
            const x2c = x == lines[y][0] ? lines[y][1] : x - 1
            if (lines[y][x2c - lines[y][0] + 2] !== '#') {
              x = x2c
            }
          }
          break
        case 1:
          while (step--) {
            const y2c = y == columns[x][1] ? columns[x][0] : y + 1
            if (columns[x][y2c - columns[x][0] + 2] !== '#') {
              y = y2c
            }
          }
          break
        case 3:
          while (step--) {
            const y2c = y == columns[x][0] ? columns[x][1] : y - 1
            if (columns[x][y2c - columns[x][0] + 2] !== '#') {
              y = y2c
            }
          }
          break
      }
    }
  })
  console.log(1000 * (y + 1) + 4 * (x + 1) + d)
})
