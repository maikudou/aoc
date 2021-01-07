var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let direction = 'E'
let x = 0
let y = 0

const moveDirection = (direction, value) => {
  switch (direction) {
    case 'E':
      x += value
      break
    case 'W':
      x -= value
      break
    case 'N':
      y -= value
      break
    case 'S':
      y += value
      break
  }
}

const rotate = (degrees, currentDirection) => {
  const directions = ['N', 'E', 'S', 'W']
  const currentIndex = directions.indexOf(currentDirection)
  let newIndex = currentIndex + degrees / 90
  newIndex = newIndex < 0 ? 4 + newIndex : newIndex
  newIndex = newIndex > 3 ? newIndex - 4 : newIndex
  return directions[newIndex]
}

lineReader.on('line', function (line) {
  let [_, command, value] = /^(\w)(\d+)$/.exec(line)
  value = parseInt(value, 10)
  switch (command) {
    case 'F':
      moveDirection(direction, value)
      break
    case 'N':
    case 'S':
    case 'E':
    case 'W':
      moveDirection(command, value)
      break
    case 'L':
      direction = rotate(-value, direction)
      break
    case 'R':
      direction = rotate(value, direction)
      break
  }
})

lineReader.on('close', function () {
  console.log(Math.abs(x) + Math.abs(y))
})
