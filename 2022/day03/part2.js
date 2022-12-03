var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const a = 97
const A = 65

function priority(letter) {
  return letter.charCodeAt(0) < 97 ? letter.charCodeAt(0) - 38 : letter.charCodeAt(0) - 96
}

let sum = 0

let group = []
let linenum = 0

lineReader.on('line', function (line) {
  group.push(line.split(''))
  if (group.length === 3) {
    sum += group.reduce(
      ([left, center, sum], elf, index, arr) => {
        if (index === 0) {
          elf.forEach(letter => left.add(letter))
        } else if (index === 1) {
          elf.forEach(letter => center.add(letter))
        } else {
          elf.some(letter => {
            if (left.has(letter) && center.has(letter)) {
              sum = priority(letter)
              return true
            } else {
              return false
            }
          })
        }
        return [left, center, sum]
      },
      [new Set(), new Set(), 0]
    )[2]

    group = []
  }
  linenum++
})

lineReader.on('close', function () {
  console.log(sum)
})
