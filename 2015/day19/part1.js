var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var results = []
var replacements = {}
var molecule

lineReader.on('line', function (line) {
  var split = line.split(' => ')
  if (split.length == 2) {
    if (replacements[split[0]]) {
      replacements[split[0]].push(split[1])
    } else {
      replacements[split[0]] = [split[1]]
    }
  } else {
    molecule = line
  }
})

var startIndex = 0
var nextIndex = 0
var result = null

lineReader.on('close', function () {
  for (var replacementSearch in replacements) {
    for (var i = 0; i < replacements[replacementSearch].length; i++) {
      startIndex = 0
      var replacement = replacements[replacementSearch][i]
      while ((nextIndex = molecule.indexOf(replacementSearch, startIndex)) > -1) {
        startIndex = nextIndex + 1
        result =
          molecule.substr(0, nextIndex) +
          replacement +
          molecule.substr(nextIndex + replacementSearch.length)
        if (results.indexOf(result) === -1) {
          results.push(result)
        }
      }
    }
  }
  console.log(results.length)
})
