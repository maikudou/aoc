const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

lineReader.on('line', function (line) {
  const fragmented = []
  line
    .split('')
    .map(toDecimal)
    .forEach((count, index) => {
      if (index % 2) {
        // empty
        for (let i = 0; i < count; i++) {
          fragmented.push('.')
        }
      } else {
        // file
        for (let i = 0; i < count; i++) {
          fragmented.push(Math.floor(index / 2))
        }
      }
    })

  let indexLeft = fragmented.findIndex(v => v === '.')
  let indexRight = fragmented.length - 1
  while (fragmented[indexRight] === '.') {
    indexRight--
  }

  while (indexLeft <= indexRight) {
    const id = fragmented[indexRight]
    fragmented[indexRight] = '.'
    while (fragmented[indexRight] === '.' && indexRight > -1) {
      indexRight--
    }
    fragmented[indexLeft] = id
    while (fragmented[indexLeft] !== '.' && indexLeft <= fragmented.length - 1) {
      indexLeft++
    }
  }
  console.log(
    fragmented.reduce((acc, value, index) => (value === '.' ? acc : acc + value * index), 0)
  )
})

lineReader.on('close', function () {})
