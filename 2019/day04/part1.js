const start = 153517
const end = 630395

var current = start
var count = 0

while (current <= end) {
  var arr = current
    .toString(10)
    .split('')
    .map(num => parseInt(num, 10))
  var eq = false
  var inc = true
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] === arr[i - 1]) {
      eq = true
    }
    if (arr[i] < arr[i - 1]) {
      inc = false
      break
    }
  }
  if (eq && inc) {
    count++
  }
  current++
}

console.log(count)
