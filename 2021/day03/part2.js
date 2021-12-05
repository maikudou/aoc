var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const counts = []
const data = []
let length = 0

lineReader.on('line', function (line) {
  const bin = parseInt(line, 2)
  length = length || line.length
  data.push(bin)
  for (let i = 0; i < line.length; i++) {
    counts[i] = counts[i] || [0, 0]
    counts[i][Math.pow(2, i) & bin ? 1 : 0]++
  }
})

function getCounts(bins) {
  return bins
    .reduce((acc, value) => {
      for (let i = 0; i < length; i++) {
        acc[i] = acc[i] || [0, 0]
        acc[i][Math.pow(2, i) & value ? 1 : 0]++
      }
      return acc
    }, [])
    .reverse()
}

lineReader.on('close', function () {
  let oxigen = data.slice()
  for (let i = 0; i < length; i++) {
    if (oxigen.length == 1) {
      break
    }
    const oxCounts = getCounts(oxigen)
    const common = oxCounts[i][1] >= oxCounts[i][0] ? 1 : 0
    const binaryPosition = Math.pow(2, length - 1 - i)
    oxigen = oxigen.filter(bin => {
      return common ? !!(bin & binaryPosition) : !(bin & binaryPosition)
    })
  }

  let CO = data.slice()
  for (let i = 0; i < length; i++) {
    if (CO.length == 1) {
      break
    }
    const oxCounts = getCounts(CO)
    const common = oxCounts[i][1] >= oxCounts[i][0] ? 1 : 0
    const binaryPosition = Math.pow(2, length - 1 - i)
    CO = CO.filter(bin => {
      return common ? !(bin & binaryPosition) : !!(bin & binaryPosition)
    })
  }
  console.log(oxigen[0] * CO[0])
})
