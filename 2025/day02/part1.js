const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

function isRepeating(string) {
  let l = 1
  if (string.length % 2) {
    return false
  }
  let good = false
  while (l <= string.length / 2) {
    if (string.length % l === 0) {
      const times = string.length / l
      let prev = string.substring(0, l)
      for (let i = 1; i < times; i++) {
        if (string.substring(l * i, l * i + l) !== prev) {
          good = false
          break
        } else {
          good = true
        }
      }
    }
    l++
  }
  return good
}

let sum = 0

lineReader.on('line', function (line) {
  const pairs = line.split(',')
  pairs.forEach(pair => {
    const ids = pair.split('-')
    const to = toDecimal(ids[1])
    for (i = toDecimal(ids[0]); i <= to; i++) {
      if (isRepeating(String(i))) {
        // console.log(i)
        sum += i
      }
    }
  })
})

lineReader.on('close', function () {
  console.log(sum)
})
