const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/test')
})

const immuneSystem = []
const infection = []
let currentArmy = immuneSystem

function sortByAttack(a, b) {
  if (a.count * a.damage === b.count * b.damage) {
    a.initiative - b.initiative
  } else {
    return a.count * a.damage - b.count * b.damage
  }
}

let number = 0
lineReader.on('line', function (line) {
  if (line === 'Immune System:') {
    currentArmy = immuneSystem
  } else if (line === 'Infection:') {
    currentArmy = infection
    number = 0
  } else if (line) {
    number++
    const [_, unitCount, hp, immune, weak, damage, damageKind, initiative] =
      /(\d+) units each with (\d+) hit points \((?:immune to ([\s\w,]+); )?weak to ([\s\w,]+)+\) with an attack that does (\d+) (\w+) damage at initiative (\d+)/.exec(
        line
      )
    currentArmy.push({
      number,
      count: toDecimal(unitCount),
      hp: toDecimal(hp),
      immuneTo: new Set(immune ? immune.split(', ') : []),
      weakTo: new Set(weak ? weak.split(', ') : []),
      damage: toDecimal(damage),
      damageKind,
      initiative: toDecimal(initiative)
    })
  }
})

lineReader.on('close', function () {
  infection.sort(sortByAttack)
  console.log(infection)
})
