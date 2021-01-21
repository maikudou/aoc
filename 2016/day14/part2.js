var crypto = require('crypto')
var key = 'ngcjuoqr'

const keys = []

const md5s = new Map()

function getMD5(i) {
  if (md5s.has(i)) {
    return md5s.get(i)
  }
  var hash = String(
    crypto
      .createHash('md5')
      .update(key + i)
      .digest('hex')
  )
  for (var h = 0; h < 2016; h++) {
    hash = String(crypto.createHash('md5').update(hash).digest('hex'))
  }
  md5s.set(i, hash)
  return md5s.get(i)
}

var i = 0
while (keys.length < 64) {
  var hash = getMD5(i)
  var isPotentialKey = false
  var toSearch

  for (var j = 1; j < hash.length - 1; j++) {
    if (hash[j - 1] === hash[j] && hash[j] === hash[j + 1]) {
      isPotentialKey = true
      toSearch = `${hash[j]}${hash[j]}${hash[j]}${hash[j]}${hash[j]}`
      break
    }
  }

  if (isPotentialKey) {
    for (var k = i + 1; k <= i + 1000; k++) {
      var nextHash = getMD5(k)
      if (nextHash.indexOf(toSearch) > -1) {
        keys.push(i)
        break
      }
    }
  }
  i++
}

console.log(keys[63])
