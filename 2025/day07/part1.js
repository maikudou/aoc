var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let count = 0
let rays = new Set()
lineReader.on('line', function (line) {
  if (/^\.+$/.test(line)) {
    return
  }
  if (/S/.test(line)) {
    rays.add(line.indexOf('S'))
    return
  }
  let lastIndex = line.indexOf('^')
  while (lastIndex > -1) {
    if (rays.has(lastIndex)) {
      count++
      rays.add(lastIndex - 1)
      rays.add(lastIndex + 1)
      rays.delete(lastIndex)
    }
    lastIndex = line.indexOf('^', lastIndex + 1)
  }
})

lineReader.on('close', function () {
  console.log(count)
})
