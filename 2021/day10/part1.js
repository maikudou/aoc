var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let score = 0

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
          score += 3
        }
        break
      case ']':
        if (stack.pop() != '[') {
          corrupted = true
          score += 57
        }
        break
      case '}':
        if (stack.pop() != '{') {
          corrupted = true
          score += 1197
        }
        break
      case '>':
        if (stack.pop() != '<') {
          corrupted = true
          score += 25137
        }
        break
    }
    if (corrupted) {
      break
    }
  }
})

lineReader.on('close', function () {
  console.log(score)
})
