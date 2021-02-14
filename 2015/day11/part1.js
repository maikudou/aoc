var input = 'vzbxkghb'

var exclude = /i|o|l/gi
var include = /(.)(?=\1).*(.)(?!\1)(?=\2)/gi

var found = false

var highestCharCode = 'z'.charCodeAt(0)
var lowestCharCode = 'a'.charCodeAt(0)

var lastIndex = input.length - 1
var currentIndex = lastIndex

function incrementLetter() {
  var charCode = input.charCodeAt(currentIndex)
  charCode++

  var newLetter = ''

  if (charCode > highestCharCode) {
    newLetter = String.fromCharCode(lowestCharCode)
  } else {
    newLetter = String.fromCharCode(charCode)
  }

  var newInput =
    input.substr(0, currentIndex) +
    newLetter +
    input.substr(currentIndex + 1, input.length - currentIndex)
  input = newInput

  return charCode > highestCharCode
}

while (found === false) {
  if (currentIndex < 0) {
    found = true
    break
  }
  if (currentIndex > lastIndex) {
    currentIndex = lastIndex
  }

  if (incrementLetter(currentIndex)) {
    currentIndex--
    if (incrementLetter(currentIndex)) {
      currentIndex--
      if (incrementLetter(currentIndex)) {
        currentIndex--
        if (incrementLetter(currentIndex)) {
          currentIndex--
          if (incrementLetter(currentIndex)) {
            currentIndex--
            if (incrementLetter(currentIndex)) {
              currentIndex--
              if (incrementLetter(currentIndex)) {
                currentIndex--
                incrementLetter(currentIndex)
              } else {
                currentIndex = lastIndex
              }
            } else {
              currentIndex = lastIndex
            }
          } else {
            currentIndex = lastIndex
          }
        } else {
          currentIndex = lastIndex
        }
      } else {
        currentIndex = lastIndex
      }
    } else {
      currentIndex = lastIndex
    }
  } else {
    currentIndex = lastIndex
  }

  if (!exclude.test(input)) {
    if (include.test(input)) {
      for (var i = 0; i < input.length - 2; i++) {
        var first = input.charCodeAt(i)
        var second = input.charCodeAt(i + 1)
        var third = input.charCodeAt(i + 2)
        if (first === second - 1 && second === third - 1) {
          console.log(input)
          found = true
          break
        }
      }
      // console.log(input);
    }
  }
}
