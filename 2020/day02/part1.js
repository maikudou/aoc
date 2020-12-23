var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var passwordsCount = 0

lineReader.on('line', function (line) {
  const [_, from, to, letter, password] = /^(\d+)-(\d+) (\w): (\w+)$/.exec(line)
  let count = 0
  for (var i = 0; i < password.length; i++) {
    if (password[i] == letter) {
      count++
    }
  }
  if (count >= parseInt(from, 10) && count <= parseInt(to, 10)) {
    passwordsCount++
  }
})

lineReader.on('close', function () {
  console.log(passwordsCount)
})
