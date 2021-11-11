const { createCanvas } = require('canvas')
const { writeFileSync } = require('fs')
const { join } = require('path')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const map = new Set()
let minY = Infinity
let maxY = 0
let minX = Infinity
let maxX = 0

lineReader.on('line', function (line) {
  let [_, c1, c1Value, c2, c2RangeStart, c2RangeEnd] = /^(x|y)=(\d+), (x|y)=(\d+)\.\.(\d+)$/.exec(
    line
  )

  c1Value = parseInt(c1Value, 10)
  c2RangeStart = parseInt(c2RangeStart, 10)
  c2RangeEnd = parseInt(c2RangeEnd, 10)

  for (let i = c2RangeStart; i <= c2RangeEnd; i++) {
    if (c1 === 'x') {
      map.add(`${c1Value}|${i}`)
      maxY = Math.max(i, maxY)
      minY = Math.min(i, minY)
      maxX = Math.max(c1Value, maxX)
      minX = Math.min(c1Value, minX)
    } else {
      map.add(`${i}|${c1Value}`)
      maxX = Math.max(i, maxX)
      minX = Math.min(i, minX)
      maxY = Math.max(c1Value, maxY)
      minY = Math.min(c1Value, minY)
    }
  }
})

function renderStep(ctx, canvas, cells, step, startX, startY, multiplier) {
  return
  for (cell of cells) {
    const [x, y] = cell.split('|')
    ctx.fillStyle = 'blue'
    ctx.fillRect((x - minX + 1) * multiplier, (y - minY + 1) * multiplier, multiplier, multiplier)
  }

  ctx.fillStyle = 'green'
  ctx.fillRect(
    (startX - minX + 1) * multiplier,
    (startY - minY + 1) * multiplier,
    multiplier,
    multiplier
  )

  var out = join(__dirname, 'render', `${step}.png`)
  writeFileSync(out, canvas.toBuffer())
}

lineReader.on('close', function () {
  const multiplier = 8
  const width = maxX - minX + 3
  const height = maxY - minY + 3
  var canvas = createCanvas(width * multiplier, height * multiplier)
  var ctx = canvas.getContext('2d')
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, width * multiplier, height * multiplier)

  for (cell of map) {
    const [x, y] = cell.split('|')
    ctx.fillStyle = 'white'
    ctx.fillRect((x - minX + 1) * multiplier, (y - minY + 1) * multiplier, multiplier, multiplier)
  }

  var out = join(__dirname, 'render', `!start.png`)
  writeFileSync(out, canvas.toBuffer())

  const watered = new Set()
  const unsettled = new Set()

  const nextXY = [[500, minY - 1]]

  let downSteps = 0

  while (nextXY.length) {
    downSteps++
    let [x, y] = nextXY.shift()

    const startX = x
    const startY = y

    // pour down
    while (y < maxY && !map.has(`${x}|${y + 1}`) && !watered.has(`${x}|${y + 1}`)) {
      y++
      // console.log('|', x, y)
      watered.add(`${x}|${y}`)
      unsettled.add(`${x}|${y}`)
    }

    // console.log(x, y, maxY)

    if (y >= maxY) {
      continue
    }

    // fill
    let openLeft = null
    let openRight = null
    let fillY = y
    let fillX = x

    if (watered.has(`${x}|${y + 1}`)) {
      // hit water, check if there is a wall on both sides
      let checkWaterX = x
      let checkWaterY = y
      while (
        watered.has(`${checkWaterX - 1}|${checkWaterY + 1}`) &&
        !map.has(`${checkWaterX - 1}|${checkWaterY}`)
      ) {
        checkWaterX--
      }
      if (!map.has(`${checkWaterX - 1}|${checkWaterY}`)) {
        openLeft = [checkWaterX - 1, checkWaterY]
      }
      while (
        watered.has(`${checkWaterX + 1}|${checkWaterY + 1}`) &&
        !map.has(`${checkWaterX + 1}|${checkWaterY}`)
      ) {
        checkWaterX++
      }
      if (!map.has(`${checkWaterX + 1}|${checkWaterY}`)) {
        openRight = [checkWaterX + 1, checkWaterY]
      }
      if (openLeft || openRight) {
        renderStep(ctx, canvas, watered, downSteps, startX, startY, multiplier)
        continue
      }
    }
    while (!openLeft && !openRight) {
      // console.log(openLeft, openRight, fillX, fillY)
      let thisRow = new Set()

      fillX = x
      watered.add(`${fillX}|${fillY}`)
      thisRow.add(`${fillX}|${fillY}`)
      while (
        (map.has(`${fillX - 1}|${fillY + 1}`) || watered.has(`${fillX - 1}|${fillY + 1}`)) &&
        !map.has(`${fillX - 1}|${fillY}`)
      ) {
        fillX--
        watered.add(`${fillX}|${fillY}`)
        thisRow.add(`${fillX}|${fillY}`)
      }
      if (!map.has(`${fillX - 1}|${fillY}`)) {
        openLeft = [fillX - 1, fillY]
      }

      fillX = x
      while (
        (map.has(`${fillX + 1}|${fillY + 1}`) || watered.has(`${fillX + 1}|${fillY + 1}`)) &&
        !map.has(`${fillX + 1}|${fillY}`)
      ) {
        fillX++
        watered.add(`${fillX}|${fillY}`)
        thisRow.add(`${fillX}|${fillY}`)
      }
      if (!map.has(`${fillX + 1}|${fillY}`)) {
        openRight = [fillX + 1, fillY]
      }
      fillY--

      if (!openRight && !openLeft) {
        thisRow.forEach(cell => {
          unsettled.delete(cell)
        })
      } else {
        thisRow.forEach(cell => {
          unsettled.add(cell)
        })
      }
    }
    if (openRight) {
      watered.add(`${openRight[0]}|${openRight[1]}`)
      unsettled.add(`${openRight[0]}|${openRight[1]}`)
      nextXY.push(openRight.slice(0))
    }
    if (openLeft) {
      watered.add(`${openLeft[0]}|${openLeft[1]}`)
      unsettled.add(`${openLeft[0]}|${openLeft[1]}`)
      nextXY.push(openLeft.slice(0))
    }
    // console.log(x, y, watered.size, openLeft, openRight, fillY)

    renderStep(ctx, canvas, watered, downSteps, startX, startY, multiplier)
  }

  console.log(watered.size - unsettled.size)

  for (cell of watered) {
    const [x, y] = cell.split('|')
    ctx.fillStyle = 'blue'
    ctx.fillRect((x - minX + 1) * multiplier, (y - minY + 1) * multiplier, multiplier, multiplier)
  }
  for (cell of unsettled) {
    const [x, y] = cell.split('|')
    ctx.fillStyle = 'green'
    ctx.fillRect((x - minX + 1) * multiplier, (y - minY + 1) * multiplier, multiplier, multiplier)
  }

  var out = join(__dirname, 'render', `final.png`)
  writeFileSync(out, canvas.toBuffer())
})
