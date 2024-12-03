var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let lines = ''

lineReader.on('line', function (line) {
  lines = `${lines}${line}`
})

let sum = 0

lineReader.on('close', function () {
  const split = lines.split("don't()")
  const matcher = /mul\(\d+,\d+\)/g
  split[0].match(matcher).forEach(match => {
    const [, a, b] = /mul\((\d+),(\d+)\)/.exec(match)
    sum += parseInt(a, 10) * parseInt(b, 10)
  })

  split.slice(1).forEach(disabled => {
    const enabled = disabled.split('do()').slice(1).join('')
    const matcher = /mul\(\d+,\d+\)/g
    if (enabled) {
      enabled.match(matcher).forEach(match => {
        const [, a, b] = /mul\((\d+),(\d+)\)/.exec(match)
        sum += parseInt(a, 10) * parseInt(b, 10)
      })
    }
  })

  console.log(sum)
})
