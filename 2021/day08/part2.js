var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let sum = 0

function sortString(string) {
  return string.split('').sort().join('')
}

lineReader.on('line', function (line) {
  const split = line.split(' | ')
  const patterns = split[0].split(' ').sort((a, b) => a.length - b.length)
  const output = split[1].split(' ').map(sortString)
  const one = patterns.shift()
  const seven = patterns.shift()
  const four = patterns.shift()
  const eight = patterns.pop()

  const a = seven.split('').find(value => one.indexOf(value) == -1)

  let possibleFCount = patterns.reduce(
    (acc, value) => acc + (value.indexOf(one[0]) == -1 ? 1 : 0),
    0
  )

  const f = possibleFCount == 1 ? one[0] : one[1]
  const c = f === one[0] ? one[1] : one[0]

  const indexOfTwo = patterns.findIndex(pattern => pattern.indexOf(f) == -1)

  const two = patterns.splice(indexOfTwo, 1)[0]

  const fiveOrThree = patterns.filter(pattern => pattern.length == 5)
  const zeroSixOrNine = patterns.filter(pattern => pattern.length == 6)

  const five = fiveOrThree.find(pattern => pattern.indexOf(c) == -1)
  const three = fiveOrThree.filter(pattern => pattern != five)[0]

  const six = zeroSixOrNine.find(pattern => pattern.indexOf(c) == -1)
  const zeroOrNine = zeroSixOrNine.filter(pattern => pattern != six)

  const e = six.split('').find(value => five.indexOf(value) == -1)

  const zero = zeroOrNine.find(pattern => pattern.indexOf(e) > -1)
  const nine = zeroOrNine.find(pattern => pattern.indexOf(e) == -1)

  const match = {}
  match[sortString(zero)] = 0
  match[sortString(one)] = 1
  match[sortString(two)] = 2
  match[sortString(three)] = 3
  match[sortString(four)] = 4
  match[sortString(five)] = 5
  match[sortString(six)] = 6
  match[sortString(seven)] = 7
  match[sortString(eight)] = 8
  match[sortString(nine)] = 9

  sum += match[output[0]] * 1000 + match[output[1]] * 100 + match[output[2]] * 10 + match[output[3]]
})

lineReader.on('close', function () {
  console.log(sum)
})
