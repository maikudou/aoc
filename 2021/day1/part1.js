var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let count = 0
let prevNum = Infinity

lineReader.on('line', function (line) {
  const num = parseInt(line, 10)
  if (num > prevNum) {
    count++
  }
  prevNum = num
})

lineReader.on('close', function () {
  console.log(count)
})
