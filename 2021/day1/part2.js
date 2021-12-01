var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let count = 0

nums = []

lineReader.on('line', function (line) {
  const num = parseInt(line, 10)
  nums.push(num)
})

lineReader.on('close', function () {
  const sums = []
  nums.forEach((num, index) => {
    if (index > 1) {
      sums.push(num + nums[index - 1] + nums[index - 2])
    }
  })

  let count = 0
  let prevNum = Infinity

  sums.forEach(num => {
    if (num > prevNum) {
      count++
    }
    prevNum = num
  })
  console.log(count)
})
