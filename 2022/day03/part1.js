var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const a = 97
const A = 65

function priority(letter) {
  return letter.charCodeAt(0) < 97 ? letter.charCodeAt(0) - 38 : letter.charCodeAt(0) - 96
}

let sum = 0

lineReader.on('line', function (line) {
  sum += line.split('').reduce(
    ([left, right, sum], letter, index, arr) => {
      if (sum) {
        return [left, right, sum]
      }
      if (index < arr.length / 2) {
        left.add(letter)
        if (right.has(letter)) {
          sum = priority(letter)
        }
      } else {
        right.add(letter)
        if (left.has(letter)) {
          sum = priority(letter)
        }
      }
      return [left, right, sum]
    },
    [new Set(), new Set(), 0]
  )[2]
})

lineReader.on('close', function () {
  console.log(sum)
})
