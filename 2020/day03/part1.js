var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const map = []

lineReader.on('line', function (line) {
  map.push(
    line.split('').reduce((acc, current) => {
      acc.push(current === '#')
      return acc
    }, [])
  )
})

lineReader.on('close', function () {
  let x = 0
  let y = 0
  let trees = 0
  const rowsCount = map.length
  const lineLength = map[0].length
  while (y < rowsCount) {
    if (map[y][x % lineLength]) {
      trees++
    }
    x += 3
    y += 1
  }
  console.log(trees)
})
