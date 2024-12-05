var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

var rulesDone = false
const pageSets = []
const rules = []

lineReader.on('line', function (line) {
  if (!line) {
    rulesDone = true
    return
  }
  if (rulesDone) {
    pageSets.push(line.split(','))
  } else {
    rules.push(line.split('|'))
  }
})

lineReader.on('close', function () {
  const rulesProcessed = new Map()
  rules.forEach(([target, after]) => {
    if (!rulesProcessed.has(after)) {
      rulesProcessed.set(after, new Set([target]))
    } else {
      rulesProcessed.get(after).add(target)
    }
  })
  let sum = 0
  pageSets.forEach(pages => {
    const shouldNotBeThere = new Set()
    if (
      !pages.every(page => {
        if (rulesProcessed.has(page)) {
          Array.from(rulesProcessed.get(page).values()).forEach(pageShouldBeBefore => {
            shouldNotBeThere.add(pageShouldBeBefore)
          })
        }
        if (shouldNotBeThere.has(page)) {
          return false
        } else {
          return true
        }
      })
    ) {
      sum += parseInt(
        pages.sort((a, b) => {
          return rulesProcessed.has(a)
            ? rulesProcessed.get(a).has(b)
              ? -1
              : rulesProcessed.has(b)
              ? rulesProcessed.get(b).has(a)
                ? 1
                : 0
              : 0
            : 0
        })[Math.floor(pages.length / 2)],
        10
      )
    }
  })
  console.log(sum)
})
