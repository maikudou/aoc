var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let root = null

lineReader.on('line', function (line) {
  let current = null
  line.split(' ').forEach(stone => {
    const newStone = {
      value: stone,
      next: null
    }
    if (root === null) {
      root = newStone
    }
    if (current) {
      current.next = newStone
    }
    current = newStone
  })
})

lineReader.on('close', function () {
  for (let i = 0; i < 25; i++) {
    let current = root
    while (current) {
      if (current.value === '0') {
        current.value = '1'
      } else if (current.value.length % 2 === 0) {
        const newStone = {
          value: String(parseInt(current.value.substring(current.value.length / 2), 10)),
          next: current.next
        }
        current.value = String(parseInt(current.value.substring(0, current.value.length / 2)))
        current.next = newStone
        current = newStone
      } else {
        current.value = String(current.value * 2024)
      }

      current = current.next
    }
  }
  let count = 0
  current = root
  while (current) {
    count++
    current = current.next
  }
  console.log(count)
})
