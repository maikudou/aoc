var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var words
var valid
var count = 0

lineReader.on('line', function (line) {
  const hashMap = new Set()
  valid = true
  words = line.split(/\s+/)
  for (var i = 0; i < words.length; i++) {
    if (hashMap.has(words[i])) {
      valid = false
      break
    }
    hashMap.add(words[i])
  }
  count += valid ? 1 : 0
})

lineReader.on('close', function () {
  console.log(count)
})
