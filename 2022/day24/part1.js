const manhattanDistance = require('../../utils/manhattanDistance')
const { Heap } = require('../../utils/Heap')

const { createCanvas } = require('canvas')
const { writeFileSync, existsSync, mkdirSync, rmSync } = require('fs')
const { join } = require('path')

class MinHeap extends Heap {
  _compare(a, b) {
    return a.distTo + a.distToFinish < b.distTo + b.distToFinish
  }
}

const render = process.argv[2] === '--render'

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const state = new Map()
let height = 0
let width

lineReader.on('line', function (line) {
  if (!/#.#/.test(line)) {
    if (!width) {
      width = line.length - 2
    }
    line
      .substring(1, line.length - 1)
      .split('')
      .forEach((value, index) => {
        if (value !== '.') {
          state.set(`${index}|${height}`, { blizzards: [value], x: index, y: height })
        }
      })
    height++
  }
})

lineReader.on('close', function () {
  if (existsSync(join(__dirname, 'render'))) {
    rmSync(join(__dirname, 'render'), { recursive: true, force: true })
  }
  render && mkdirSync(join(__dirname, 'render'))
  states.set(0, state)

  let current = {
    x: 0,
    y: -1,
    distTo: 0,
    prev: null
  }
  const visited = new Set()
  const heap = new MinHeap()
  let counter = 0
  while (current) {
    if (visited.has(`${current.x}|${current.y}|${current.distTo}`)) {
      current = heap.pop()
      continue
    }

    const { x, y, distTo } = current

    const nextState = getState(distTo + 1)
    const possible = []
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          Math.abs(i) !== Math.abs(j) &&
          x + i > -1 &&
          x + i < width &&
          y + j > -1 &&
          y + j < height
        ) {
          if (!nextState.has(`${x + i}|${y + j}`)) {
            possible.push([x + i, y + j])
            heap.insert({
              x: x + i,
              y: y + j,
              distTo: distTo + 1,
              prev: current,
              distToFinish: manhattanDistance({ x: x + i, y: y + j }, { x: width - 1, y: height })
            })
          }
        }
      }
    }

    if (!possible.length) {
      if (x == 0 && y == 0) {
        heap.insert({
          x,
          y: y - 1,
          distTo: distTo + 1,
          prev: current,
          distToFinish: manhattanDistance({ x, y: y - 1 }, { x: width - 1, y: height })
        })
      } else if (!getState(distTo + 1).has(`${x}|${y}`)) {
        heap.insert({
          x,
          y,
          distTo: distTo + 1,
          prev: current,
          distToFinish: manhattanDistance({ x, y }, { x: width - 1, y: height })
        })
      }
    }

    visited.add(`${current.x}|${current.y}|${current.distTo}`)

    if (current.x == width - 1 && current.y === height - 1) {
      if (render) {
        renderPNG(getState(current.distTo + 1), current.x, current.y + 1, `${distTo + 1}`)
        let prev = current
        while (prev) {
          renderPNG(getState(prev.distTo), prev.x, prev.y, `${prev.distTo}`)
          prev = prev.prev
        }
      }
      console.log(current.distTo + 1)
      break
    }
    current = heap.pop()
  }
})

const states = new Map()

function getState(minute) {
  if (states.has(minute)) {
    return states.get(minute)
  } else {
    const state = simulate(getState(minute - 1))
    states.set(minute, state)
    return state
  }
}

function simulate(state) {
  const newState = new Map()
  for (cell of state.values()) {
    for (blizzard of cell.blizzards) {
      let x = cell.x
      let y = cell.y
      switch (blizzard) {
        case '>':
          x++
          if (x === width) {
            x = 0
          }
          break
        case '<':
          x--
          if (x === -1) {
            x = width - 1
          }
          break
        case '^':
          y--
          if (y === -1) {
            y = height - 1
          }
          break
        case 'v':
          y++
          if (y === height) {
            y = 0
          }
          break
      }
      const cellBlizzards = newState.get(`${x}|${y}`)?.blizzards || []
      cellBlizzards.push(blizzard)
      newState.set(`${x}|${y}`, { x, y, blizzards: cellBlizzards })
    }
  }
  return newState
}

function renderText(state) {
  console.log(`# ${''.padEnd(width, '#')}`)
  for (let i = 0; i < height; i++) {
    process.stdout.write('#')
    for (let j = 0; j < width; j++) {
      process.stdout.write(
        state.has(`${j}|${i}`)
          ? state
              .get(`${j}|${i}`)
              .blizzards.reduce(
                (acc, value, _, arr) => (arr.length === 1 ? value : String(arr.length)),
                ''
              )
          : '.'
      )
    }
    process.stdout.write('#\n')
  }
  console.log(`${''.padEnd(width, '#')} #`)
}

function renderPNG(state, x, y, name) {
  const multiplier = 16

  var canvas = createCanvas((width + 2) * multiplier, (height + 2) * multiplier)
  var ctx = canvas.getContext('2d')
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, (width + 2) * multiplier, (height + 2) * multiplier)

  ctx.lineWidth = multiplier / 8
  ctx.strokeStyle = 'green'
  ctx.beginPath()
  ctx.ellipse(
    (x + 1.5) * multiplier,
    (y + 1.5) * multiplier,
    multiplier / 4,
    multiplier / 4,
    0,
    0,
    2 * Math.PI
  )
  ctx.stroke()

  ctx.fillStyle = 'gray'
  x = 0
  y = 0
  ctx.fillRect(x * multiplier + 1, y * multiplier + 1, multiplier - 2, multiplier - 2)
  for (let i = 2; i < width + 2; i++) {
    ctx.fillRect(i * multiplier + 1, y * multiplier + 1, multiplier - 2, multiplier - 2)
  }
  for (let i = 0; i < height; i++) {
    ctx.fillRect(1, (i + 1) * multiplier + 1, multiplier - 2, multiplier - 2)
    ctx.fillRect(
      (width + 1) * multiplier + 1,
      (i + 1) * multiplier + 1,
      multiplier - 2,
      multiplier - 2
    )
    ctx.fillStyle = 'rgba(255,0,0,0.25)'
    ctx.strokeStyle = 'rgba(255,0,0,0.25)'
    ctx.font = `${multiplier * 0.9}px monospace bold`
    for (let j = 0; j < width; j++) {
      if (state.has(`${j}|${i}`)) {
        const symbols = state.get(`${j}|${i}`).blizzards

        if (symbols.length === 1) {
          ctx.lineWidth = multiplier / 8
          ctx.beginPath()
          switch (symbols[0]) {
            case '>':
              ctx.strokeStyle = 'rgba(255,255,0,0.25)'
              drawArrow(ctx, (j + 1) * multiplier, (i + 1) * multiplier, multiplier, 2)
              break
            case '<':
              ctx.strokeStyle = 'rgba(255,0,255,0.25)'
              drawArrow(ctx, (j + 1) * multiplier, (i + 1) * multiplier, multiplier, 2, Math.PI)
              break
            case 'v':
              ctx.strokeStyle = 'rgba(255,0,0,0.25)'
              drawArrow(
                ctx,
                (j + 1) * multiplier,
                (i + 1) * multiplier,
                multiplier,
                2,
                0.5 * Math.PI
              )
              break
            case '^':
              ctx.strokeStyle = 'rgba(0,0,255,0.25)'
              drawArrow(
                ctx,
                (j + 1) * multiplier,
                (i + 1) * multiplier,
                multiplier,
                2,
                1.5 * Math.PI
              )
              break
          }
          ctx.stroke()
        } else {
          ctx.lineWidth = multiplier / 16
          symbols.forEach((symbol, index) => {
            ctx.beginPath()
            let x = index == 1 || index === 3 ? multiplier / 2 : 0
            let y = index > 1 ? multiplier / 2 : 0
            switch (symbol) {
              case '>':
                ctx.strokeStyle = 'rgba(255,255,0,0.25)'
                drawArrow(
                  ctx,
                  x + (j + 1) * multiplier,
                  y + (i + 1) * multiplier,
                  multiplier / 2,
                  1
                )
                ctx.stroke()
                break
              case '<':
                ctx.strokeStyle = 'rgba(255,0,255,0.25)'
                drawArrow(
                  ctx,
                  x + (j + 1) * multiplier,
                  y + (i + 1) * multiplier,
                  multiplier / 2,
                  1,
                  Math.PI
                )
                ctx.stroke()
                break
              case 'v':
                ctx.strokeStyle = 'rgba(255,0,0,0.25)'
                drawArrow(
                  ctx,
                  x + (j + 1) * multiplier,
                  y + (i + 1) * multiplier,
                  multiplier / 2,
                  1,
                  0.5 * Math.PI
                )
                ctx.stroke()
                break
              case '^':
                ctx.strokeStyle = 'rgba(0,0,255,0.25)'
                drawArrow(
                  ctx,
                  x + (j + 1) * multiplier,
                  y + (i + 1) * multiplier,
                  multiplier / 2,
                  1,
                  1.5 * Math.PI
                )
                ctx.stroke()
                break
            }
          })
        }
      }
    }
    ctx.fillStyle = 'gray'
  }

  for (let i = 0; i < width; i++) {
    ctx.fillRect(i * multiplier + 1, (height + 1) * multiplier + 1, multiplier - 2, multiplier - 2)
  }
  ctx.fillRect(
    (width + 1) * multiplier + 1,
    (height + 1) * multiplier + 1,
    multiplier - 2,
    multiplier - 2
  )
  var out = join(__dirname, 'render', `${name}.png`)
  writeFileSync(out, canvas.toBuffer())
}

function drawArrow(ctx, x, y, width, lineWidth, rotate = 0) {
  ctx.translate(x + width / 2, y + width / 2)
  ctx.rotate(rotate)
  ctx.translate(-(x + width / 2), -(y + width / 2))

  ctx.moveTo(x + lineWidth, y + width / 2)
  ctx.lineTo(x + width - lineWidth, y + width / 2)
  ctx.lineTo(x + width / 2, y + lineWidth)
  ctx.moveTo(x + width - lineWidth, y + width / 2)
  ctx.lineTo(x + width / 2, y + width - lineWidth)

  ctx.setTransform(1, 0, 0, 1, 0, 0)
}
