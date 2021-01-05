var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const jolts = [{ visits: 1, jolt: 0 }]

lineReader.on('line', function (line) {
  jolts.push({ visits: 1, jolt: parseInt(line, 10) })
})

lineReader.on('close', function () {
  jolts.sort((a, b) => (a.jolt > b.jolt ? 1 : a.jolt == b.jolt ? 0 : -1))
  jolts.push({ visits: 1, jolt: jolts[jolts.length - 1].jolt + 3 })

  const memo = new Map()

  const variants = index => {
    if (memo.has(index)) {
      return memo.get(index)
    }
    if (!jolts[index]) {
      memo.set(index, 1)
      return 1
    }
    if (jolts[index + 3] && jolts[index + 3].jolt - jolts[index].jolt <= 3) {
      memo.set(index, variants(index + 1) + variants(index + 2) + variants(index + 3))
      return memo.get(index)
    }
    if (jolts[index + 2] && jolts[index + 2].jolt - jolts[index].jolt <= 3) {
      memo.set(index, variants(index + 1) + variants(index + 2))
      return memo.get(index)
    }
    memo.set(index, variants(index + 1))
    return memo.get(index)
  }
  console.log(variants(0))
})
