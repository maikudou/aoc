const sorter = require('../../utils/numSorter')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const jolts = [0]

lineReader.on('line', function (line) {
  jolts.push(parseInt(line, 10))
})

lineReader.on('close', function () {
  jolts.sort(sorter)
  jolts.push(jolts[jolts.length - 1] + 3)
  let diff1 = 0
  let diff3 = 0
  jolts.map((val, index) => {
    if (index) {
      if (val - jolts[index - 1] === 1) {
        diff1++
      } else if (val - jolts[index - 1] === 3) {
        diff3++
      }
    }
  })
  console.log(diff1 * diff3)
})
