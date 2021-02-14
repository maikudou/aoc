var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var totalLinesLength = 0
var totalWordsLength = 0

lineReader.on('line', function (line) {
  totalLinesLength += line.length

  var bareLine = line.replace(/\\"|\\\\|\\x\w{2}/gi, '|')
  totalWordsLength += bareLine.length - 2
})

lineReader.on('close', function () {
  console.log(totalLinesLength - totalWordsLength)
})
