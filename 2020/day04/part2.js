var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

function createNewSet() {
  return new Set(['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid', 'cid'])
}

function createNewRegExp() {
  return /\b(?:byr:\d{4})|(?:iyr:\d{4})|(?:eyr:\d{4})|(?:hgt:\d{3}cm)|(?:hgt:\d{2}in)|(?:hcl:#[0-9a-f]{6})|(?:ecl:(?:amb|blu|brn|gry|grn|hzl|oth))|(?:pid:\d{9})\b/g
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
      const [_, field, value] = /^(\w{3}):(.+)$/.exec(result[0])
      let parsedValue

      switch (field) {
        case 'byr':
          parsedValue = parseInt(value, 10)
          if (parsedValue >= 1920 && parsedValue <= 2002) {
            currentSet.delete(field)
          }
          break
        case 'iyr':
          parsedValue = parseInt(value, 10)
          if (parsedValue >= 2010 && parsedValue <= 2020) {
            currentSet.delete(field)
          }
          break
        case 'eyr':
          parsedValue = parseInt(value, 10)
          if (parsedValue >= 2020 && parsedValue <= 2030) {
            currentSet.delete(field)
          }
          break
        case 'hgt':
          const [_, heightValue, heightUnit] = /^(\d{2,3})(.+)$/.exec(value)
          parsedValue = parseInt(heightValue, 10)
          if (
            (heightUnit == 'cm' && parsedValue >= 150 && parsedValue <= 193) ||
            (heightUnit == 'in' && parsedValue >= 59 && parsedValue <= 76)
          ) {
            currentSet.delete(field)
          }
          break
        default:
          currentSet.delete(field)
      }
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
