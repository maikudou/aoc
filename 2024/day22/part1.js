const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const buyers = []

lineReader.on('line', function (line) {
  buyers.push(toDecimal(line))
})

lineReader.on('close', function () {
  let sum = 0n

  buyers.forEach(b => {
    let num = BigInt(b)
    for (let i = 0; i < 2000; i++) {
      num = ((num * 64n) ^ num) % 16777216n
      num = ((num / 32n) ^ num) % 16777216n
      num = ((num * 2048n) ^ num) % 16777216n
    }
    sum += num
  })
  console.log(sum)
})
