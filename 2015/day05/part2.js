var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var count = 0

lineReader.on('line', function (line) {
  if (/(.).\1{1,}/gi.test(line)) {
    if (/(?:(.)(.).*\1\2){1,}/gi.test(line)) {
      count++
    }
  }
})

lineReader.on('close', function () {
  console.log(count)
})
