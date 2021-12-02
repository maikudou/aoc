var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let pos = 0
let depth = 0
let aim = 0

lineReader.on('line', function (line) {
  const [_, dir, num] = /(forward|down|up) (\d+)/.exec(line)
  // console.log(dir, num)
  switch (dir) {
    case 'forward':
      pos += parseInt(num, 10)
      depth += aim * parseInt(num, 10)
      break
    case 'down':
      aim += parseInt(num, 10)
      break
    case 'up':
      aim -= parseInt(num, 10)
  }
})

lineReader.on('close', function () {
  console.log(pos * depth)
})
