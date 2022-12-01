var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let mostCalories = 0
let currentElfCalories = 0
lineReader.on('line', function (line) {
  if (!line) {
    mostCalories = Math.max(mostCalories, currentElfCalories)
    currentElfCalories = 0
  } else {
    currentElfCalories += parseInt(line, 10)
  }
})

lineReader.on('close', function () {
  mostCalories = Math.max(mostCalories, currentElfCalories)
  console.log(mostCalories)
})
