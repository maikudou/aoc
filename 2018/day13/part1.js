var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let carts = []
const map = []
let y = 0

lineReader.on('line', function (line) {
  map.push(
    line.split('').map((cell, x) => {
      switch (cell) {
        case '>':
          carts.push({
            direction: 'e',
            intersection: 'left',
            position: {
              x,
              y
            }
          })
          return '-'
        case '<':
          carts.push({
            direction: 'w',
            intersection: 'left',
            position: {
              x,
              y
            }
          })
          return '-'
        case '^':
          carts.push({
            direction: 'n',
            intersection: 'left',
            position: {
              x,
              y
            }
          })
          return '|'
        case 'v':
          carts.push({
            direction: 's',
            intersection: 'left',
            position: {
              x,
              y
            }
          })
          return '|'
        default:
          return cell
      }
    })
  )
  y++
})

function rotateRight(direction) {
  switch (direction) {
    case 'e':
      return 's'
    case 'w':
      return 'n'
    case 'n':
      return 'e'
    case 's':
      return 'w'
  }
}

function rotateLeft(direction) {
  switch (direction) {
    case 'e':
      return 'n'
    case 'w':
      return 's'
    case 'n':
      return 'w'
    case 's':
      return 'e'
  }
}

function rotateCorner(corner, direction) {
  switch (corner) {
    case '\\':
      switch (direction) {
        case 'e':
        case 'w':
          return rotateRight(direction)
        case 's':
        case 'n':
          return rotateLeft(direction)
      }
      break
    case '/':
      switch (direction) {
        case 'e':
        case 'w':
          return rotateLeft(direction)
        case 's':
        case 'n':
          return rotateRight(direction)
      }
      break
    default:
      return direction
  }
}

lineReader.on('close', function () {
  let collision = false
  let cartPositions = new Set()
  for (let cart of carts) {
    cartPositions.add(`${cart.position.x},${cart.position.y}`)
  }
  while (!collision) {
    carts = carts.sort((a, b) => {
      return a.position.y - b.position.y == 0
        ? a.position.x - b.position.x
        : a.position.y - b.position.y
    })

    for (let cart of carts) {
      let cartNewPosition = {
        ...cart.position
      }
      switch (cart.direction) {
        case 'e':
          cartNewPosition.x = cart.position.x + 1
          break
        case 'w':
          cartNewPosition.x = cart.position.x - 1
          break
        case 'n':
          cartNewPosition.y = cart.position.y - 1
          break
        case 's':
          cartNewPosition.y = cart.position.y + 1
          break
      }

      const positionHash = `${cartNewPosition.x},${cartNewPosition.y}`

      if (cartPositions.has(positionHash)) {
        collision = positionHash
        break
      } else {
        cartPositions.delete(`${cart.position.x},${cart.position.y}`)
        cartPositions.add(positionHash)
        cart.position = {
          ...cartNewPosition
        }
        if (map[cartNewPosition.y][cartNewPosition.x] !== '+') {
          cart.direction = rotateCorner(map[cartNewPosition.y][cartNewPosition.x], cart.direction)
        } else {
          switch (cart.intersection) {
            case 'left':
              cart.direction = rotateLeft(cart.direction)
              cart.intersection = 'straigth'
              break
            case 'right':
              cart.direction = rotateRight(cart.direction)
              cart.intersection = 'left'
              break
            default:
              cart.intersection = 'right'
              break
          }
        }
      }
    }
  }
  console.log(collision)
})
