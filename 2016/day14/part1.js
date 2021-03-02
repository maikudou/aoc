var crypto = require('crypto')
var key = 'ngcjuoqr'

const keys = []
var potentialKeys = []

var i = 0
while (keys.length < 64) {
  var hash = String(
    crypto
      .createHash('md5')
      .update(key + i)
      .digest('hex')
  )
  while (potentialKeys.length && potentialKeys[0].index < i - 1000) {
    potentialKeys.shift()
  }
  var newPotentialKeys = []
  for (var k = 0; k < potentialKeys.length; k++) {
    if (hash.indexOf(potentialKeys[k].letter) > -1) {
      keys.push(potentialKeys[k].index)
      if (keys.length === 64) {
        break
      }
    } else {
      newPotentialKeys.push(potentialKeys[k])
    }
  }
  potentialKeys = newPotentialKeys
  for (var j = 1; j < hash.length - 1; j++) {
    if (hash[j - 1] === hash[j] && hash[j] === hash[j + 1]) {
      potentialKeys.push({
        letter: `${hash[j]}${hash[j]}${hash[j]}${hash[j]}${hash[j]}`,
        index: i
      })
      break
    }
  }
  i++
}

console.log(keys[63])
