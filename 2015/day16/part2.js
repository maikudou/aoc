var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var regexp = /\w+ (\d+): (\w+): (\d+), (\w+): (\d+), (\w+): (\d+)/
var tape = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1
}

lineReader.on('line', function (line) {
  var found = regexp.exec(line)
  var truenes = true

  for (var i = 2; i <= 6; i += 2) {
    if (found[i] === 'cats' || found[i] === 'trees') {
      truenes = tape[found[i]] < Number(found[i + 1])
    } else if (found[i] === 'pomeranians' || found[i] === 'goldfish') {
      truenes = tape[found[i]] > Number(found[i + 1])
    } else {
      truenes = tape[found[i]] === Number(found[i + 1])
    }
    if (!truenes) {
      return
    }
  }
  if (truenes) {
    console.log(found[1])
  }
})

lineReader.on('close', function () {})
