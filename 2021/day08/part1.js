var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let count = 0

lineReader.on('line', function (line) {
  const output = line.split(' | ')[1].split(' ')
  count = output.reduce(
    (acc, value) =>
      acc +
      (value.length == 2 || value.length == 3 || value.length == 4 || value.length == 7 ? 1 : 0),
    count
  )
})

lineReader.on('close', function () {
  console.log(count)
})
