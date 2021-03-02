var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var passwordsCount = 0

lineReader.on('line', function (line) {
  const [_, first, second, letter, password] = /^(\d+)-(\d+) (\w): (\w+)$/.exec(line)
  const firstLetter = password[parseInt(first) - 1]
  const secondLetter = password[parseInt(second) - 1]
  if (firstLetter != secondLetter && (firstLetter == letter || secondLetter == letter)) {
    passwordsCount++
  }
})

lineReader.on('close', function () {
  console.log(passwordsCount)
})
