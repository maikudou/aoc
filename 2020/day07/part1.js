var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let map = new Map()

lineReader.on('line', function (line) {
  const [_, bagName, contents, no] = /(\w+ \w+) bags contain ((no|\d+).+)/.exec(line)

  const bag = map.get('bagName') || new Set()

  if (no !== 'no') {
    contentsArray = contents.split(', ')
    for (var i = 0; i < contentsArray.length; i++) {
      const [_, bagName] = /\d+ (.+) bag/.exec(contentsArray[i])
      bag.add(bagName)
    }
  }

  map.set(bagName, bag)
})

function has(set, name) {
  const iterator = set.values()
  let next = iterator.next()
  while (!next.done) {
    if (next.value === name) {
      return true
    } else {
      if (map.has(next.value)) {
        if (has(map.get(next.value), name)) {
          return true
        }
      }
    }
    next = iterator.next()
  }
  return false
}

lineReader.on('close', function () {
  const iterator = map.keys()
  let next = iterator.next()
  let count = 0
  while (!next.done) {
    count += has(map.get(next.value), 'shiny gold') ? 1 : 0
    next = iterator.next()
  }
  console.log(count)
})
