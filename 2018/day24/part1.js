const toDecimal = require('../../utils/toDecimal')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

const immuneSystem = []
const infection = []
const both = []
let currentArmy = immuneSystem

function sortByChoiceOrder(a, b) {
  if (a.count * a.damage === b.count * b.damage) {
    return b.initiative - a.initiative
  } else {
    return b.count * b.damage - a.count * a.damage
  }
}
let attacker
function sortByAttackPreference(a, b) {
  const damage2A = a.immuneTo.has(attacker.damageKind)
    ? 0
    : a.weakTo.has(attacker.damageKind)
    ? attacker.count * attacker.damage * 2
    : attacker.count * attacker.damage

  const damage2B = b.immuneTo.has(attacker.damageKind)
    ? 0
    : b.weakTo.has(attacker.damageKind)
    ? attacker.count * attacker.damage * 2
    : attacker.count * attacker.damage

  if (damage2A === damage2B) {
    if (a.count * a.damage === b.count * b.damage) {
      return b.initiative - a.initiative
    } else {
      return b.count * b.damage - a.count * a.damage
    }
  } else {
    return damage2B - damage2A
  }
}
function sortByAttackOrder(a, b) {
  return b.initiative - a.initiative
}
function getKilledCount(attacker, victim) {
  return Math.min(
    Math.floor(
      (victim.immuneTo.has(attacker.damageKind)
        ? 0
        : victim.weakTo.has(attacker.damageKind)
        ? attacker.count * attacker.damage * 2
        : attacker.count * attacker.damage) / victim.hp
    ),
    victim.count
  )
}

let number = 0
let kind = ''
lineReader.on('line', function (line) {
  if (line === 'Immune System:') {
    currentArmy = immuneSystem
    kind = 'Immune System'
  } else if (line === 'Infection:') {
    currentArmy = infection
    kind = 'Infection'
    number = 0
  } else if (line) {
    number++
    const [_, unitCount, hp, statA, statAList, statB, statBList, damage, damageKind, initiative] =
      /(\d+) units each with (\d+) hit points (?:\((?:(weak|immune) to ([\s\w,]+);? ?)?(?:(weak|immune) to ([\s\w,]+)+)?\) )?with an attack that does (\d+) (\w+) damage at initiative (\d+)/.exec(
        line
      )

    const group = {
      kind,
      number,
      count: toDecimal(unitCount),
      hp: toDecimal(hp),
      immuneTo: new Set(
        statA === 'immune' ? statAList.split(', ') : statB === 'immune' ? statBList.split(', ') : []
      ),
      weakTo: new Set(
        statA === 'weak' ? statAList.split(', ') : statB === 'weak' ? statBList.split(', ') : []
      ),
      damage: toDecimal(damage),
      damageKind,
      initiative: toDecimal(initiative)
    }
    currentArmy.push(group)
    both.push(group)
  }
})

lineReader.on('close', function () {
  while (infection.some(({ count }) => count > 0) && immuneSystem.some(({ count }) => count > 0)) {
    let selectedInImmuneSystem = new Set()
    let selectedInInfection = new Set()
    infection
      .filter(({ count }) => count > 0)
      .sort(sortByChoiceOrder)
      .forEach(group => {
        attacker = group
        const victim = immuneSystem
          .sort(sortByAttackPreference)
          .filter(defendingGroup => !selectedInImmuneSystem.has(defendingGroup.number))[0]
        if (victim && getKilledCount(attacker, victim)) {
          group.victim = victim
          selectedInImmuneSystem.add(victim.number)
        } else {
          group.victim = null
        }
      })
    immuneSystem
      .filter(({ count }) => count > 0)
      .sort(sortByChoiceOrder)
      .forEach(group => {
        attacker = group
        const victim = infection
          .sort(sortByAttackPreference)
          .filter(defendingGroup => !selectedInInfection.has(defendingGroup.number))[0]
        if (victim && getKilledCount(attacker, victim)) {
          group.victim = victim
          selectedInInfection.add(victim.number)
        } else {
          group.victim = null
        }
      })
    both.sort(sortByAttackOrder)
    both
      .filter(({ count, victim }) => victim && count > 0)
      .forEach(attacker => {
        const killed = getKilledCount(attacker, attacker.victim)
        // console.log(
        //   `${attacker.kind} group ${attacker.number} attacks defending group ${attacker.victim.number}, killing ${killed} units`
        // )
        attacker.victim.count -= killed
      })
    // console.log('\n')
  }
  console.log(
    Math.max(
      immuneSystem.reduce((acc, { count }) => acc + count, 0),
      infection.reduce((acc, { count }) => acc + count, 0)
    )
  )
})
