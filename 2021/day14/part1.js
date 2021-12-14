var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let molecule
let rules = new Map()

lineReader.on('line', function (line) {
  if (!molecule) {
    molecule = line.split('')
  } else if (line) {
    const rule = line.split(' -> ')
    rules.set(rule[0], rule[1])
  }
})

lineReader.on('close', function () {
  for (let i = 0; i < 10; i++) {
    let newMolecule = []
    const length = molecule.length
    for (let j = 0; j < length - 1; j++) {
      newMolecule.push(molecule[j])
      const rule = rules.get(`${molecule[j]}${molecule[j + 1]}`)
      if (rule) {
        newMolecule.push(rule)
      }
    }
    newMolecule.push(molecule[molecule.length - 1])
    molecule = newMolecule
  }
  const quantities = Array.from(
    molecule
      .reduce((acc, value) => {
        acc.set(value, (acc.get(value) || 0) + 1)
        return acc
      }, new Map())
      .values()
  ).sort((a, b) => a - b)
  console.log(quantities.pop() - quantities[0])
})
