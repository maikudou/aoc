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

  let indexRight = fragmented.length - 1
  while (fragmented[indexRight] === '.') {
    indexRight--
  }
  let length = 1
  let id = fragmented[indexRight]
  indexRight--
  while (fragmented[indexRight] === id) {
    indexRight--
    length++
  }

  while (indexRight > 0) {
    const spaceStart = fragmented.findIndex(
      (v, i) =>
        v === '.' && i <= indexRight && fragmented.slice(i, i + length).every(v => v === '.')
    )
    if (spaceStart > -1) {
      for (let i = 0; i < length; i++) {
        fragmented[spaceStart + i] = id
        fragmented[indexRight + i + 1] = '.'
      }
    }
    length = 0

    let previousId = id
    id = fragmented[indexRight]

    while (id === '.' || id >= previousId) {
      indexRight--
      id = fragmented[indexRight]
    }

    while (fragmented[indexRight] === id) {
      indexRight--
      length++
    }
  }

  console.log(
    fragmented.reduce((acc, value, index) => (value === '.' ? acc : acc + value * index), 0)
  )
})

lineReader.on('close', function () {})
