var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let molecule
let rules = new Map()

lineReader.on('line', function (line) {
  if (!molecule) {
    molecule = line
  } else if (line) {
    const rule = line.split(' -> ')
    rules.set(rule[0], rule[1])
  }
})

lineReader.on('close', function () {
  const freqs = new Map()
  for (let j = 0; j < molecule.length - 1; j++) {
    freqs.set(
      `${molecule[j]}${molecule[j + 1]}`,
      freqs.get(`${molecule[j]}${molecule[j + 1]}`) || 0 + 1
    )
  }
  for (let i = 0; i < 40; i++) {
    const changedFreqs = new Map()
    Array.from(freqs.keys()).forEach(f => {
      const rule = rules.get(f)
      if (rule) {
        // console.log(rule, `${f[0]}${rule}`)

        const existingToRemove = freqs.get(f)

        // console.log(f, 'to be removed', freqs.get(f))
        changedFreqs.set(f, (changedFreqs.get(f) || 0) - freqs.get(f))

        const left = `${f[0]}${rule}`
        const right = `${rule}${f[1]}`

        // console.log(left, 'to be added', freqs.get(f))
        changedFreqs.set(left, (changedFreqs.get(left) || 0) + freqs.get(f))
        // console.log(right, 'to be added', freqs.get(f))
        changedFreqs.set(right, (changedFreqs.get(right) || 0) + freqs.get(f))
      }
    })
    // console.log(changedFreqs)
    Array.from(changedFreqs.keys()).forEach(f => {
      const result = (freqs.get(f) || 0) + changedFreqs.get(f)
      if (result <= 0) {
        freqs.delete(f)
      } else {
        freqs.set(f, result)
      }
    })
  }
  const quantities = new Map()
  Array.from(freqs.entries()).forEach(([key, value]) => {
    quantities.set(key[0], (quantities.get(key[0]) || 0) + value)
    quantities.set(key[1], (quantities.get(key[1]) || 0) + value)
  })
  const qArray = Array.from(quantities.values())
    .map(v => Math.ceil(v / 2))
    .sort((a, b) => a - b)
  console.log(qArray.pop() - qArray[0])
})
