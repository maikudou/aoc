const { createCanvas } = require('canvas')
const { writeFileSync } = require('fs')
const { join } = require('path')

function renderDists(map) {
  console.log(
    map
      .map(row => row.map(cell => (cell.visited ? cell.distance % 10 : cell.pipe)).join(''))
      .join('\n')
  )
}

const multiplier = 32

function renderCanvas(map) {
  const maxY = map.length
  const maxX = map[0].length

  var canvas = createCanvas(maxX * multiplier, maxY * multiplier)
  var ctx = canvas.getContext('2d')
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, (maxX + 1) * multiplier, (maxY + 1) * multiplier)
  insideCount

  for (var y = 0; y < maxY; y++) {
    let openedBy = null
    let lastCurveInOpen = null
    for (var x = 0; x < maxX; x++) {
      const currentCell = map[y][x]
      ctx.fillStyle = 'white'
      ctx.strokeStyle = 'black'
      ctx.font = `regular ${multiplier / 4}px monospace`

      if (currentCell.visited) {
        if (currentCell.pipe === 'S') {
          ctx.fillStyle = 'green'
        } else if (currentCell.distance === maxDist) {
          ctx.fillStyle = 'red'
        } else {
          ctx.fillStyle = 'white'
        }
        ctx.fillRect(x * multiplier, y * multiplier, multiplier, multiplier)
        ctx.lineWidth = multiplier / 16
        ctx.strokeRect(x * multiplier, y * multiplier, multiplier, multiplier)
        ctx.fillStyle = 'black'
        ctx.fillText(
          currentCell.distance,
          x * multiplier + multiplier / 8,
          y * multiplier + multiplier / 4,
          multiplier
        )

        ctx.beginPath()
        switch (currentCell.pipe) {
          case 'J':
            ctx.arc(x * multiplier, y * multiplier, multiplier / 2, 0, 0.5 * Math.PI)
            break
          case 'F':
            ctx.arc(
              (x + 1) * multiplier,
              (y + 1) * multiplier,
              multiplier / 2,
              Math.PI,
              1.5 * Math.PI
            )
            break
          case '7':
            ctx.arc(
              x * multiplier,
              (y + 1) * multiplier,
              multiplier / 2,
              1.5 * Math.PI,
              2 * Math.PI
            )
            break
          case 'L':
            ctx.arc((x + 1) * multiplier, y * multiplier, multiplier / 2, 0.5 * Math.PI, Math.PI)
            break
          case '-':
            ctx.moveTo(x * multiplier, y * multiplier + multiplier / 2)
            ctx.lineTo((x + 1) * multiplier, y * multiplier + multiplier / 2)
            break
          case '|':
            ctx.moveTo(x * multiplier + multiplier / 2, y * multiplier)
            ctx.lineTo(x * multiplier + multiplier / 2, (y + 1) * multiplier)
            break
        }
        ctx.strokeStyle = 'blue'
        ctx.lineWidth = multiplier / 8
        ctx.stroke()

        if (openedBy) {
          if (currentCell.pipe === '|') {
            openedBy = null
          } else {
            switch (lastCurveInOpen) {
              case null:
                if (
                  (openedBy === 'F' && currentCell.pipe === '7') ||
                  (openedBy === 'L' && currentCell.pipe === 'J')
                ) {
                  openedBy = null
                }
                break
              case 'F':
                if (currentCell.pipe === 'J') {
                  openedBy = null
                }
                break
              case 'L':
                if (currentCell.pipe === '7') {
                  openedBy = null
                }
                break
            }
            if (currentCell.pipe !== '|' && currentCell.pipe !== '-') {
              lastCurveInOpen = currentCell.pipe
            }
          }
        } else {
          openedBy = currentCell.pipe
          lastCurveInOpen = null
        }

        ctx.fillStyle = 'black'
        ctx.fillText(
          openedBy ? 'I' : 'O',
          (x + 1) * multiplier - multiplier / 4,
          (y + 1) * multiplier - multiplier / 4,
          multiplier
        )
      } else {
        ctx.fillStyle = openedBy ? 'purple' : 'gray'
        ctx.fillRect(x * multiplier, y * multiplier, multiplier, multiplier)
        ctx.lineWidth = multiplier / 16
        ctx.strokeRect(x * multiplier, y * multiplier, multiplier, multiplier)
      }
    }
  }

  var out = join(__dirname, 'render', `map.png`)
  writeFileSync(out, canvas.toBuffer())
}

module.exports = {
  renderDists
}
