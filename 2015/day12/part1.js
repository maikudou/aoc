var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let input

lineReader.on('line', function (line) {
  input = JSON.parse(line)
})

lineReader.on('close', function () {
  var sum = 0

  function parseAndSum(item) {
    if (typeof item === 'object') {
      var keys = Object.keys(item)
      for (var i = 0; i < keys.length; i++) {
        if (typeof item[keys[i]] === 'number') {
          sum += item[keys[i]]
        } else {
          parseAndSum(item[keys[i]])
        }
      }
    }
  }

  parseAndSum(input)

  console.log(sum)
})
