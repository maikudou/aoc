const input = 265149

var width = 1
var height = 1
var value = 1
var direction = 'R'

var x = 0
var y = 0

while (value < input) {
  switch (direction) {
    case 'R':
      for (var i = 0; i < width && value < input; i++) {
        value++
        x++
      }
      width += 2
      direction = 'U'
      break
    case 'U':
      for (var i = 0; i < height && value < input; i++) {
        value++
        y++
      }
      height += 2
      direction = 'L'
      break
    case 'L':
      for (var i = 0; i < width - 1 && value < input; i++) {
        value++
        x--
      }
      direction = 'D'
      break
    case 'D':
      for (var i = 0; i < height - 1 && value < input; i++) {
        value++
        y--
      }
      direction = 'R'
      break
  }
}

console.log(Math.abs(x) + Math.abs(y))
