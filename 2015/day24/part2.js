var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let packages = []

lineReader.on('line', function (line) {
  packages.push(parseInt(line, 10))
})

lineReader.on('close', function () {
  const sum = packages.reduce(function (acc, value) {
    return (acc += value)
  }, 0)

  const groupWeight = sum / 4

  var variants = new Map()
  var newVariants

  for (var i = 0; i < packages.length; i++) {
    const set = new Set()
    set.add(packages[i])
    variants.set(String(packages[i]), set)
  }

  var minLength = Infinity
  var variantsArray = Array.from(variants)
  var minLengthFound = false

  while (!minLengthFound) {
    variantsArray = Array.from(variants)
    for (var variant of variantsArray) {
      var runningSum = Array.from(variant[1]).reduce(function (acc, value) {
        return acc + value
      }, 0)
      if (runningSum === groupWeight) {
        minLength = variant[1].size
        minLengthFound = true
      }
    }
    if (minLengthFound) {
      break
    }
    newVariants = new Map()
    for (var k = 0; k < variantsArray.length; k++) {
      for (var l = 0; l < packages.length; l++) {
        var currentPackage = packages[l]
        if (!variantsArray[k][1].has(currentPackage)) {
          var runningSum2 = Array.from(variantsArray[k][1]).reduce(function (acc, value) {
            return acc + value
          }, 0)
          var id = variantsArray[k][0].split('|')
          id.push(currentPackage)
          id = id
            .sort(function (a, b) {
              return a === b ? 0 : a < b ? -1 : 1
            })
            .join('|')
          if (runningSum2 + currentPackage <= groupWeight && !newVariants.has(id)) {
            const set = new Set(Array.from(variantsArray[k][1]))
            set.add(currentPackage)
            newVariants.set(id, set)
          }
        }
      }
    }
    variants = newVariants
  }

  variantsArray = Array.from(variants)

  var minQE = Infinity

  for (var variant of variantsArray) {
    var runningSum = Array.from(variant[1]).reduce(function (acc, value) {
      return acc + value
    }, 0)
    if (runningSum === groupWeight) {
      minQE = Math.min(
        minQE,
        Array.from(variant[1]).reduce(function (acc, value) {
          return acc * value
        }, 1)
      )
    }
  }

  console.log(minQE)
})
