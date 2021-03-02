var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var words
var word
var valid
var count = 0

lineReader.on('line', function (line) {
  const hashMap = new Set()
  valid = true
  words = line.split(/\s+/)
  for (var i = 0; i < words.length; i++) {
    word = words[i].split('').sort().join('')
    if (hashMap.has(word)) {
      valid = false
      break
    }
    hashMap.add(word)
  }
  count += valid ? 1 : 0
})

lineReader.on('close', function () {
  console.log(count)
})
