var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const blocks = []

lineReader.on('line', function (line) {
  line = line.split('/')
  blocks.push([parseInt(line[0], 10), parseInt(line[1], 10)])
})

function getVariants(end, blocks) {
  return blocks.filter(block => block[0] == end || block[1] == end)
}

const results = []

function getStrength(end, length, rstrength, block, blocks) {
  const variants = getVariants(end, blocks)
  if (variants.length == 0) {
    results.push({
      length: length,
      strength: rstrength + block[0] + block[1]
    })
    return block[0] + block[1]
  }
  return (
    block[0] +
    block[1] +
    variants.reduce((acc, variant) => {
      const strength = getStrength(
        variant[0] == end ? variant[1] : variant[0],
        length + 1,
        rstrength + block[0] + block[1],
        variant,
        blocks.filter(v => v != variant)
      )
      return Math.max(acc, strength)
    }, -Infinity)
  )
}

lineReader.on('close', function () {
  getStrength(0, 0, 0, [0, 0], blocks)
  console.log(
    results.reduce(
      (acc, value) => (value.strength >= acc.strength && value.length >= acc.length ? value : acc),
      { length: 0, strength: 0 }
    ).strength
  )
})
