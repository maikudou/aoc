var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let sum = 0

lineReader.on('line', function (line) {
  const [_, w, p] = /Card\s+\d+: ([\d\s]+)\|([\d\s]+)/g.exec(line)
  const winning = new Set(w.trim().replace(/\s+/g, ' ').split(' '))
  const playing = p.trim().replace(/\s+/g, ' ').split(' ')
  sum += playing.reduce((acc, num) => {
    if (winning.has(num)) {
      acc = acc ? acc * 2 : 1
    }
    return acc
  }, 0)
})

lineReader.on('close', function () {
  console.log(sum)
})
