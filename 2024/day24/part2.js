var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/test')
})

lineReader.on('line', function (line) {})

lineReader.on('close', function () {})
