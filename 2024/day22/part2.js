const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const buyers = []

lineReader.on('line', function (line) {
  buyers.push(toDecimal(line))
})

lineReader.on('close', function () {
  const buyersSequences = []
  buyers.forEach(b => {
    let prevDigit = null
    let diffs = []
    let num = BigInt(b)
    const sequences = new Map()
    for (let i = 0; i < 2000; i++) {
      num = ((num * 64n) ^ num) % 16777216n
      num = ((num / 32n) ^ num) % 16777216n
      num = ((num * 2048n) ^ num) % 16777216n

      const digit = num % 10n

      const diff = prevDigit === null ? null : digit - prevDigit

      if (diffs.length > 2) {
        const sequence = diffs.slice(-3).concat(diff).join(',')
        if (!sequences.has(sequence)) {
          sequences.set(sequence, Number(digit))
        }
      }

      diff !== null && diffs.push(diff)
      prevDigit = digit
    }
    buyersSequences.push(sequences)
  })
  let sum = 0
  for (let i = 0; i < buyersSequences.length; i++) {
    Array.from(buyersSequences[i].entries()).forEach(([sequence, price]) => {
      let localSum = price
      for (let j = 0; j < buyersSequences.length && j !== i; j++) {
        localSum += buyersSequences[j].get(sequence) || 0
      }
      sum = Math.max(sum, localSum)
    })
  }
  console.log(sum)
})
