var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var totalLinesLength = 0
var totalWordsLength = 0

lineReader.on('line', function (line) {
  totalLinesLength += line.length

  var fatLine = line.replace(/(\\|")/gi, '\\$1')
  totalWordsLength += fatLine.length + 2
})

lineReader.on('close', function () {
  console.log(totalWordsLength - totalLinesLength)
})
