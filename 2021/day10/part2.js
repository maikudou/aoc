var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const lines = []
let scores = []

lineReader.on('line', function (line) {
  let stack = []
  let corrupted = false
  for (let i = 0; i < line.length; i++) {
    switch (line[i]) {
      case '(':
      case '[':
      case '{':
      case '<':
        stack.push(line[i])
        break
      case ')':
        if (stack.pop() != '(') {
          corrupted = true
        }
        break
      case ']':
        if (stack.pop() != '[') {
          corrupted = true
        }
        break
      case '}':
        if (stack.pop() != '{') {
          corrupted = true
        }
        break
      case '>':
        if (stack.pop() != '<') {
          corrupted = true
        }
        break
    }
    if (corrupted) {
      break
    }
  }
  if (!corrupted) {
    scores.push(
      stack
        .reverse()
        .reduce(
          (acc, value) => acc * 5 + (value == '(' ? 1 : value == '[' ? 2 : value == '{' ? 3 : 4),
          0
        )
    )
  }
})

lineReader.on('close', function () {
  console.log(scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)])
})
