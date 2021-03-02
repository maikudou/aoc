var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let x = 0
let y = 0
let wpx = 10
let wpy = -1

const moveShip = value => {
  diffX = wpx - x
  diffY = wpy - y

  x += value * diffX
  y += value * diffY

  wpx += value * diffX
  wpy += value * diffY
}

const moveWaypoint = (direction, value) => {
  switch (direction) {
    case 'E':
      wpx += value
      break
    case 'W':
      wpx -= value
      break
    case 'N':
      wpy -= value
      break
    case 'S':
      wpy += value
      break
  }
}

const rotate = degrees => {
  if (degrees < 0) {
    degrees = 360 + degrees
  }
  diffX = wpx - x
  diffY = wpy - y

  switch (degrees) {
    case 90:
      wpx = x - diffY
      wpy = y + diffX
      break
    case 180:
      wpx = x - diffX
      wpy = y - diffY
      break
    case 270:
      wpx = x + diffY
      wpy = y - diffX
      break
  }
}

lineReader.on('line', function (line) {
  let [_, command, value] = /^(\w)(\d+)$/.exec(line)
  value = parseInt(value, 10)
  switch (command) {
    case 'F':
      moveShip(value)
      break
    case 'N':
    case 'S':
    case 'E':
    case 'W':
      moveWaypoint(command, value)
      break
    case 'L':
      direction = rotate(-value)
      break
    case 'R':
      direction = rotate(value)
      break
  }
})

lineReader.on('close', function () {
  console.log(Math.abs(x) + Math.abs(y))
})
