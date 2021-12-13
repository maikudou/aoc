const toDecimal = require('../../utils/toDecimal')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let mode = 'input'
let page = new Set()

lineReader.on('line', function (line) {
  if (!line) {
    mode = 'fold'
    return
  }
  if (mode === 'input') {
    page.add(line)
  } else {
    const [_, foldAlong, foldCoord] = /^fold along (x|y)=(\d+)$/.exec(line)

    const dots = Array.from(page.keys())
      .map(key => {
        const [x, y] = key.split(',').map(toDecimal)
        return { x, y }
      })
      .sort((a, b) => a[foldAlong] - b[foldAlong])

    const partition = { low: [], high: [] }

    for (let i = 0; i < dots.length; i++) {
      if (dots[i][foldAlong] > foldCoord) {
        partition.high = dots.slice(i)
        break
      } else {
        partition.low.push(dots[i])
      }
    }

    const newPage = new Set(partition.low.map(dot => `${dot.x},${dot.y}`))
    partition.high.forEach(dot => {
      dot[foldAlong] -= (dot[foldAlong] - foldCoord) * 2
      newPage.add(`${dot.x},${dot.y}`)
    })

    console.log(newPage.size)
    process.exit(0)
  }
})

lineReader.on('close', function () {})
