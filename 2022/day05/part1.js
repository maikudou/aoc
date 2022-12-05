const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let state = true
const crates = []
lineReader.on('line', function (line) {
  if (!line) {
    state = false
  }
  if (state) {
    const regex = /\[(\S+)\]/g
    let result
    while ((result = regex.exec(line))) {
      const [_, crate] = result
      const { index } = result
      if (!crates[index / 4]) {
        crates[index / 4] = []
      }
      crates[index / 4].push(crate)
    }
  } else if (/move (\d+) from (\d+) to (\d+)/.test(line)) {
    const [_, count, from, to] = /move (\d+) from (\d+) to (\d+)/.exec(line)
    for (let i = 0; i < count; i++) {
      crates[toDecimal(to) - 1].unshift(crates[toDecimal(from) - 1].shift())
    }
  }
})

lineReader.on('close', function () {
  console.log(
    crates
      .reduce((acc, val) => {
        acc.push(val[0])
        return acc
      }, [])
      .join('')
  )
})
