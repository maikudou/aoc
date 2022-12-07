const { parseLine, root } = require('./parser')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

lineReader.on('line', parseLine)

function traverse(dir) {
  return (
    (dir.size <= 100000 ? dir.size : 0) +
    Array.from(dir.children.values())
      .filter(d => d.children)
      .reduce((acc, value) => acc + traverse(value), 0)
  )
}

lineReader.on('close', function () {
  console.log(traverse(root))
})
