const toDecimal = require('../../utils/toDecimal')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let mode = 'input'
let page = new Set()

function visualize(page) {
  const dots = Array.from(page.keys())
    .map(key => {
      const [x, y] = key.split(',').map(toDecimal)
      return { x, y }
    })
    .sort((a, b) => a.x - b.x)
    .sort((a, b) => a.y - b.y)

  let y = dots[0].y
  let maxX = 0
  let nextDot = dots.shift()
  while (nextDot) {
    let x = -1
    let line = []
    while (nextDot && nextDot.y == y) {
      for (let i = x; i < nextDot.x - 1; i++) {
        line.push('.')
      }
      line.push('#')
      maxX = Math.max(maxX, nextDot.x)
      x = nextDot.x
      nextDot = dots.shift()
    }
    for (let i = x; i < maxX; i++) {
      line.push('.')
    }
    console.log(line.join(''))
    // console.log(nextDot)
    if (nextDot) {
      for (let i = y; i < nextDot.y - y - 1; i++) {
        let line = []
        for (let j = 0; j <= maxX; j++) {
          line.push('.')
        }
        console.log(line.join(''))
      }
      y = nextDot.y
    }
  }
}

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

    page = newPage
  }
})

lineReader.on('close', function () {
  console.log(page.size)
  visualize(page)
})
