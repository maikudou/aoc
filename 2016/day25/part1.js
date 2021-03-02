const { parseInstruction, processSimplerInstructions } = require('../../utils/assembunny')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var instructions = []

lineReader.on('line', function (line) {
  instructions.push(parseInstruction(line))
})

lineReader.on('close', function () {
  let found = false
  a = 0
  let halter = false
  while (!found && a < 30000) {
    const time = Date.now()
    const output = []
    halter = false
    processSimplerInstructions(
      instructions,
      { a: a, b: 0, c: 0, d: 0 },
      value => {
        output.push(value)
        if (output.length == 18) {
          halter = true
        }
      },
      () => halter
    )

    if (output.join('') == '010101010101010101') {
      console.log(a)
      found = true
    }
    a++
  }
})
