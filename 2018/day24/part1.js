var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(__dirname + '/input')
})

let mode = 'Immune System'
let num = 0

const IS = []
const I = []

const debug = false

const winConsoleDebug = console.debug
console.debug = (...attrs) => {
  if (debug) {
    winConsoleDebug.apply(null, attrs)
  }
}

function logArmyState(army) {
  if (!debug) return
  const remaining = army.filter(group => group.numUnits > 0)
  console.debug(`${army[0].army}:`)
  if (remaining.length) {
    remaining.forEach(group => {
      console.debug(`Group ${group.id} contains ${group.numUnits} units`)
    })
  } else {
    console.debug('No groups remain.')
  }
}

function logPossiblyDamages(attacker, defenders) {
  if (!debug) return
  defenders.forEach(defender => {
    if (defender.numUnits) {
      console.debug(
        `${attacker.army} group ${attacker.id} would deal defending group ${
          defender.id
        } ${getPossibleDamage(attacker, defender)} damage`
      )
    }
  })
}

function logAttack(attacker, damageDealt, victim) {
  if (!debug) return
  if (damageDealt && victim.numUnits) {
    console.debug(
      `${attacker.army} group ${attacker.id} attacks defending group ${
        victim.id
      }, killing ${Math.min(victim.numUnits, Math.floor(damageDealt / victim.hp))} units`
    )
  }
}

lineReader.on('line', function (line) {
  if (line === 'Immune System:' || !line) {
    return
  }
  if (line === 'Infection:') {
    mode = 'Infection'
    num = 0
  } else {
    const [_, numUnits, hp, perk, perkTo, perk2, perk2To, attackPoints, attackType, initiative] =
      /(\d+) units each with (\d+) hit points (?:\((?:(weak|immune) to ([\w\, ]+))(?:; (weak|immune) to ([\w\, ]+))?\) )?with an attack that does (\d+) (\w+) damage at initiative (\d+)/.exec(
        line
      )

    // console.log(line, perkTo)
    ;(mode === 'Immune System' ? IS : I).push({
      id: ++num,
      army: mode,
      numUnits: parseInt(numUnits, 10),
      hp: parseInt(hp, 10),
      immuneTo: [
        ...(perk === 'immune' ? perkTo.split(', ') : []),
        ...(perk2 === 'immune' ? perk2To.split(', ') : [])
      ],
      weakTo: [
        ...(perk === 'weak' ? perkTo.split(', ') : []),
        ...(perk2 === 'weak' ? perk2To.split(', ') : [])
      ],
      attackPoints: parseInt(attackPoints, 10),
      attackType,
      initiative: parseInt(initiative, 10)
    })
  }
})

function effectivePower(group) {
  return group.numUnits * group.attackPoints
}

function selectionOrder(a, b) {
  const epa = effectivePower(a)
  const epb = effectivePower(b)
  return epa === epb ? b.initiative - a.initiative : epb - epa
}

function victimsOrder(attacker, a, b) {
  const aDamage = getPossibleDamage(attacker, a)
  const bDamage = getPossibleDamage(attacker, b)
  return aDamage === bDamage ? selectionOrder(a, b) : bDamage - aDamage
}

function getPossibleDamage(attacker, defendent) {
  return defendent.immuneTo.includes(attacker.attackType)
    ? 0
    : effectivePower(attacker) * (defendent.weakTo.includes(attacker.attackType) ? 2 : 1)
}

lineReader.on('close', function () {
  let ISAttackers
  let IAttackers
  while (true) {
    // Sort both armies based on selection order priority
    ISAttackers = IS.slice()
      .filter(a => a.numUnits > 0)
      .sort(selectionOrder)
    IAttackers = I.slice()
      .filter(a => a.numUnits > 0)
      .sort(selectionOrder)

    if (!ISAttackers.length || !IAttackers.length) {
      break
    }
    logArmyState(IS)
    logArmyState(I)
    console.debug('')

    const ISDefenders = IS.slice()
    const IDefenders = I.slice()

    IAttackers.forEach(attacker => {
      logPossiblyDamages(attacker, ISDefenders)
      attacker.victim = ISDefenders.sort(victimsOrder.bind(null, attacker)).shift()
      if (getPossibleDamage(attacker, attacker.victim) === 0) {
        ISDefenders.unshift(attacker.victim)
        attacker.victim = undefined
      }
    })

    ISAttackers.forEach(attacker => {
      logPossiblyDamages(attacker, IDefenders)
      attacker.victim = IDefenders.sort(victimsOrder.bind(null, attacker)).shift()
      if (getPossibleDamage(attacker, attacker.victim) === 0) {
        IDefenders.unshift(attacker.victim)
        attacker.victim = undefined
      }
    })

    console.debug('')

    const attackOrder = []
      .concat(ISAttackers, IAttackers)
      .sort((a, b) => b.initiative - a.initiative)

    attackOrder.forEach(attacker => {
      const { victim } = attacker
      if (!victim) {
        return
      }
      const damageDealt = getPossibleDamage(attacker, victim)
      logAttack(attacker, damageDealt, victim)
      victim.numUnits -= Math.floor(damageDealt / victim.hp)
      victim.numUnits = Math.max(0, victim.numUnits)
    })
    console.debug('')
  }
  logArmyState(IS)
  logArmyState(I)
  if (ISAttackers.length) {
    console.log(ISAttackers.reduce((acc, value) => acc + value.numUnits, 0))
  } else {
    console.log(IAttackers.reduce((acc, value) => acc + value.numUnits, 0))
  }
})
