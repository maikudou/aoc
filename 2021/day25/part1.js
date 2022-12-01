var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let east = new Map()
let south = new Map()

let y = 0
let width
lineReader.on('line', function (line) {
  width = line.length
  line.split('').forEach((char, x) => {
    switch (char) {
      case '>':
        east.set(`${x}|${y}`, { x, y })
        break
      case 'v':
        south.set(`${x}|${y}`, { x, y })
        break
    }
  })
  y++
})

lineReader.on('close', function () {
  const height = y
  // console.log(east, south)
  let moved = true
  let moves = 0
  while (moved) {
    moved = false
    const newEast = new Map()
    const newSouth = new Map()
    Array.from(east.values()).forEach(e => {
      let nextX = e.x == width - 1 ? 0 : e.x + 1
      if (!east.has(`${nextX}|${e.y}`) && !south.has(`${nextX}|${e.y}`)) {
        newEast.set(`${nextX}|${e.y}`, { x: nextX, y: e.y })
        // console.log('>', e)
        moved = true
      } else {
        newEast.set(`${e.x}|${e.y}`, e)
      }
    })
    east = newEast

    Array.from(south.values()).forEach(e => {
      let nextY = e.y == height - 1 ? 0 : e.y + 1
      if (!east.has(`${e.x}|${nextY}`) && !south.has(`${e.x}|${nextY}`)) {
        newSouth.set(`${e.x}|${nextY}`, { x: e.x, y: nextY })
        // console.log('v', e)
        moved = true
      } else {
        newSouth.set(`${e.x}|${e.y}`, e)
      }
    })
    south = newSouth
    moves++
  }
  console.log(moves)
})
