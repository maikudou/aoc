var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let stones

lineReader.on('line', function (line) {
  let current = null
  stones = line
})

function processStones(stonesMap) {
  const newMap = new Map()
  stonesMap.forEach((count, stone) => {
    if (stone === '0') {
      newMap.set('1', (newMap.get('1') || 0) + count)
    } else if (stone.length % 2 === 0) {
      const left = stone.substring(0, stone.length / 2)
      newMap.set(left, (newMap.get(left) || 0) + count)
      const right = String(parseInt(stone.substring(stone.length / 2)))
      newMap.set(right, (newMap.get(right) || 0) + count)
    } else {
      const newStone = String(stone * 2024)
      newMap.set(newStone, (newMap.get(newStone) || 0) + count)
    }
  })
  return newMap
}

lineReader.on('close', function () {
  let stonesMap = stones.split(' ').reduce((acc, value) => {
    const count = acc.get(value) || 0
    acc.set(value, count + 1)
    return acc
  }, new Map())

  for (let i = 0; i < 75; i++) {
    stonesMap = processStones(stonesMap)
  }

  console.log(Array.from(stonesMap.values()).reduce((acc, value) => acc + value, 0))
})
