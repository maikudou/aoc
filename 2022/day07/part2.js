const { parseLine, root } = require('./parser')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const spaceTotal = 70000000
const spaceRequired = 30000000

lineReader.on('line', parseLine)

function findSmallestEnough(freeSpace, dir, sizeSoFar) {
  if (freeSpace + dir.size < spaceRequired) {
    return sizeSoFar
  }
  return Array.from(dir.children.values())
    .filter(d => d.children)
    .reduce((acc, value) => {
      return Math.min(acc, findSmallestEnough(freeSpace, value, dir.size))
    }, dir.size)
}

lineReader.on('close', function () {
  const freeSpace = spaceTotal - root.size
  console.log(findSmallestEnough(freeSpace, root, root))
})
