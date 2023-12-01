var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let sum = 0
lineReader.on('line', function (line) {
  sum += fromSnafu(line)
})

lineReader.on('close', function () {
  console.log(toSnafu(sum))
})

function fromSnafu(string) {
  const snafu = string
    .split('')
    .map(s => (isNaN(s) ? s : parseInt(s, 10)))
    .reverse()
  return snafu.reduce((acc, value, index) => {
    return acc + Math.pow(5, index) * (value === '-' ? -1 : value === '=' ? -2 : value)
  }, 0)
}

function toSnafu(value, power = 5) {
  const remainder = value % power
  const smartRemainder = (remainder / power) * 5
  if (smartRemainder < 3) {
    if (remainder === 0) {
      return `${toSnafu(value / power)}0`
    } else {
      if (value < power) {
        return String(smartRemainder)
      } else {
        return `${toSnafu(value - remainder, power * 5)}${smartRemainder}`
      }
    }
  } else {
    return `${toSnafu((value - remainder) / power + 1)}${smartRemainder == 3 ? '=' : '-'}`
  }
}
