var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var replacements = {}
var molecule
var minimum = false

lineReader.on('line', function (line) {
  var split = line.split(' => ')
  if (split.length == 2) {
    replacements[split[1]] = split[0]
  } else {
    molecule = line
  }
})

lineReader.on('close', function () {
  getVariations(molecule, 1)
  console.log(minimum)
})

function getVariations(input, steps) {
  var variations = []

  if (input === 'HF' || input === 'NAl' || input === 'OMg') {
    if (!minimum) {
      minimum = steps
    }
    if (steps < minimum) {
      minimum = steps
    }
  }

  for (var replacementSearch in replacements) {
    if (replacements[replacementSearch] === 'e') {
      continue
    }
    var startIndex = 0
    var nextIndex
    while ((nextIndex = input.indexOf(replacementSearch, startIndex)) > -1) {
      startIndex = nextIndex + 1
      var variant =
        input.substr(0, nextIndex) +
        replacements[replacementSearch] +
        input.substr(nextIndex + replacementSearch.length)
      if (variations.indexOf(variant) === -1) {
        variations.push(variant)
      }
    }
  }
  for (var i in variations) {
    getVariations(variations[i], steps + 1)
  }
  return variations
}
