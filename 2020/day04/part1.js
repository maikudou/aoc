var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

function createNewSet() {
  return new Set(['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid', 'cid'])
}

function createNewRegExp() {
  return /\b(?:byr)|(?:iyr)|(?:eyr)|(?:hgt)|(?:hcl)|(?:ecl)|(?:pid)|(?:cid)\b/g
}

let validCount = 0
let currentSet = createNewSet()
let currentRegExp = createNewRegExp()

lineReader.on('line', function (line) {
  if (!line) {
    if (currentSet.size === 0 || (currentSet.size === 1 && currentSet.has('cid'))) {
      validCount++
    }
    currentSet = createNewSet()
  } else {
    let result = currentRegExp.exec(line)
    while (result) {
      currentSet.delete(result[0])
      result = currentRegExp.exec(line)
    }
  }
})

lineReader.on('close', function () {
  if (currentSet.size === 0 || (currentSet.size === 1 && currentSet.has('cid'))) {
    validCount++
  }
  console.log(validCount)
})
