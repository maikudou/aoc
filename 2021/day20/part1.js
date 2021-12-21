var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let enchancement
let row = 0
let image = new Map()

function getBinary(x, y) {
  let num = 0
  for (let i = y - 1; i <= y + 1; i++) {
    for (let j = x - 1; j <= x + 1; j++) {
      num = num << 1
      num |= image.has(`${j}|${i}`) ? 1 : 0
    }
  }
  return num
}

lineReader.on('line', function (line) {
  if (!enchancement) {
    enchancement = line
  } else if (line) {
    line.split('').forEach((char, index) => {
      if (char == '#') {
        image.set(`${index}|${row}`, { x: index, y: row })
      }
    })
    row++
  }
})

function getExtremes() {
  return Array.from(image.values()).reduce(
    (acc, value) => {
      return {
        minX: Math.min(acc.minX, value.x),
        minY: Math.min(acc.minY, value.y),
        maxX: Math.max(acc.maxX, value.x),
        maxY: Math.max(acc.maxY, value.y)
      }
    },
    {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    }
  )
}

lineReader.on('close', function () {
  const { minX, minY, maxX, maxY } = getExtremes()

  for (let iteration = 0; iteration < 2; iteration++) {
    const newImage = new Map()

    for (let y = minY - (iteration ? 5 : 10); y <= maxY + (iteration ? 5 : 10); y++) {
      for (let x = minX - (iteration ? 5 : 10); x <= maxX + (iteration ? 5 : 10); x++) {
        if (enchancement[getBinary(x, y)] == '#') {
          newImage.set(`${x}|${y}`, { x, y })
        }
      }
    }
    image = newImage
  }
  console.log(image.size)
})
