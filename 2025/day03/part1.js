var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let sum = 0

lineReader.on('line', function (line) {
  let max1 = 0
  let max2 = 0
  for (let i = 0; i < line.length; i++) {
    if (i < line.length - 1 && max1 < line[i]) {
      max1 = line[i]
      max2 = line[i + 1]
    } else {
      max2 = Math.max(max2, line[i])
    }
  }
  sum += Number(`${max1}${max2}`)
})

lineReader.on('close', function () {
  console.log(sum)
})
