const sorter = require('../../utils/numSorterDesc')
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const calories = []
let currentElfCalories = 0
lineReader.on('line', function (line) {
  if (!line) {
    calories.push(currentElfCalories)
    currentElfCalories = 0
  } else {
    currentElfCalories += parseInt(line, 10)
  }
})

lineReader.on('close', function () {
  calories.push(currentElfCalories)
  console.log(
    calories
      .sort(sorter)
      .slice(0, 3)
      .reduce((acc, value) => acc + value, 0)
  )
})
