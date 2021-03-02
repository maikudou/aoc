var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let map = new Map()

lineReader.on('line', function (line) {
  const [_, bagName, contents, no] = /(\w+ \w+) bags contain ((no|\d+).+)/.exec(line)

  const bag = map.get('bagName') || new Map()

  if (no !== 'no') {
    contentsArray = contents.split(', ')
    for (var i = 0; i < contentsArray.length; i++) {
      const [_, bagCount, bagName] = /(\d+) (.+) bag/.exec(contentsArray[i])
      bag.set(bagName, bagCount)
    }
  }

  map.set(bagName, bag)
})

function countBag(bag) {
  const iterator = bag.entries()
  let next = iterator.next()
  let count = 1
  while (!next.done) {
    count += next.value[1] * countBag(map.get(next.value[0]))
    next = iterator.next()
  }
  return count
}

lineReader.on('close', function () {
  console.log(countBag(map.get('shiny gold')) - 1)
})
