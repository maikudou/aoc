var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const locks = []
const keys = []

let lock = null
let key = null

let row = 0

lineReader.on('line', function (line) {
  if (!line) {
    row = 0
    lock = null
    key = null
    return
  }
  if (row === 0 && line === '#####') {
    lock = []
    row++
    return
  }
  if (row === 0 && line === '.....') {
    key = []
    row++
    return
  }
  row++
  if (row === 7) {
    if (lock) {
      locks.push(
        lock.reduce(
          (acc, value) => {
            for (let i = 0; i < 5; i++) {
              acc[i] += value[i] === '#' ? 1 : 0
            }
            return acc
          },
          [0, 0, 0, 0, 0]
        )
      )
    } else {
      keys.push(
        key.reduce(
          (acc, value) => {
            for (let i = 0; i < 5; i++) {
              acc[i] += value[i] === '#' ? 1 : 0
            }
            return acc
          },
          [0, 0, 0, 0, 0]
        )
      )
    }
    return
  }
  ;(lock || key).push(line.split(''))
})

lineReader.on('close', function () {
  let count = 0
  locks.forEach(lock => {
    keys.forEach(key => {
      if (lock.every((d, i) => d + key[i] <= 5)) {
        count++
      }
    })
  })
  console.log(count)
})
