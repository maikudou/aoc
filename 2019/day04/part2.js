const start = 153517
const end = 630395

var current = start
var count = 0

while (current <= end) {
  var arr = current
    .toString(10)
    .split('')
    .map(num => parseInt(num, 10))
  var inc = true

  var pretenders = new Map()

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] === arr[i - 1]) {
      pretenders.set(arr[i], (pretenders.get(arr[i]) || 1) + 1)
    }
    if (arr[i] < arr[i - 1]) {
      inc = false
      break
    }
  }

  if (inc) {
    var pretendersArray = Array.from(pretenders)
    for (var j = 0; j < pretendersArray.length; j++) {
      if (pretendersArray[j][1] === 2) {
        count++
        break
      }
    }
  }
  current++
}

console.log(count)
