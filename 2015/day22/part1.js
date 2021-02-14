/* eslint-disable complexity */

var bossHitPoints = 55
const bossDamage = 8

var hitPoints = 50
var mana = 500

const spells = [
  {
    name: 'magicMissile',
    cost: 53,
    damage: 4,
    heal: 0,
    armor: 0,
    mana: 0,
    effect: 0
  },
  {
    name: 'drain',
    cost: 73,
    damage: 2,
    heal: 2,
    armor: 0,
    mana: 0,
    effect: 0
  },
  {
    name: 'shield',
    cost: 113,
    damage: 0,
    heal: 0,
    armor: 7,
    mana: 0,
    effect: 6
  },
  {
    name: 'poison',
    cost: 173,
    damage: 3,
    heal: 0,
    armor: 0,
    mana: 0,
    effect: 6
  },
  {
    name: 'recharge',
    cost: 229,
    damage: 0,
    heal: 0,
    armor: 0,
    mana: 101,
    effect: 5
  }
]

var min = Infinity

function getAvailableSpells(mana) {
  return spells.filter(function (spell) {
    return spell.cost <= mana
  })
}

function explore(step) {
  var availableSpells = getAvailableSpells(step.mana)
  var nextSpell
  var bossDamageValue

  if (step.manaSpent > min) {
    // console.log(`> manaSpent ${step.manaSpent} is bigger than min value of ${min}`);
    return
  }

  if (availableSpells.length === 0) {
    availableSpells.push({
      name: 'empty',
      cost: 0,
      damage: 0,
      heal: 0,
      armor: 0,
      mana: 0,
      effect: 0
    })
  }

  if (--step.hitPoints <= 0) {
    return
  }

  for (var i = 0; i < availableSpells.length; i++) {
    nextSpell = availableSpells[i]

    if (nextSpell.effect && step.currentEffect && step.currentEffect.has(nextSpell.name)) {
      continue
    }

    var armor = 0
    if (step.currentEffect && step.currentEffect.has('shield')) {
      armor = step.currentEffect.get('shield').armor
    }
    // console.log('-- Player turn --');
    // console.log(`- Player has ${step.hitPoints} hit points, ${armor} armor, ${step.mana} mana`);
    // console.log(`- Boss has ${step.bossHitPoints} hit points`);

    if (step.currentEffect && step.currentEffect.has('shield')) {
      // console.log(`${step.currentEffect.get('shield').name} granted ${step.currentEffect.get('shield').armor} armor! ${step.currentEffect.get('shield').effect - 1} turns left`);
    }

    var nextStep = {
      mana: step.mana - nextSpell.cost,
      manaSpent: step.manaSpent + nextSpell.cost,
      hitPoints: step.hitPoints,
      bossHitPoints: step.bossHitPoints,
      currentEffect: step.currentEffect
        ? new Map(
            Array.from(step.currentEffect).map(function (effect) {
              effect[1] = Object.assign({}, effect[1])
              return effect
            })
          )
        : new Map()
    }

    if (step.currentEffect && step.currentEffect.size) {
      for (var effect of Array.from(step.currentEffect)) {
        // console.log(effect[1], effect[0]);
        // effect[1].damage && console.log(`${effect[1].name} deals ${effect[1].damage} damage! ${effect[1].effect - 1} turns left`);
        nextStep.bossHitPoints -= effect[1].damage
        // effect[1].mana && console.log(`${effect[1].name} granted ${effect[1].mana} mana! ${effect[1].effect - 1} turns left`);
        nextStep.mana += effect[1].mana
        nextStep.currentEffect.get(effect[0]).effect--
        if (nextStep.currentEffect.get(effect[0]).effect === 0) {
          nextStep.currentEffect.delete(effect[0])
        }
      }
    }

    if (nextSpell.effect) {
      if (nextStep.currentEffect && nextStep.currentEffect.has(nextSpell.name)) {
        continue
      } else {
        nextStep.currentEffect.set(nextSpell.name, Object.assign({}, nextSpell))
        // console.log(`Player casts ${nextSpell.name}`);
      }
    } else {
      // console.log(
      //     `Player casts ${nextSpell.name}`,
      //     nextSpell.damage ? `dealing ${nextSpell.damage} damage` : '',
      //     nextSpell.heal ? `healing for ${nextSpell.heal} points` : ''
      // );
      nextStep.bossHitPoints -= nextSpell.damage
      nextStep.hitPoints += nextSpell.heal
    }

    if (nextStep.bossHitPoints <= 0) {
      // console.log('Player win!', nextStep.manaSpent, nextStep.mana, '\n');
      min = Math.min(min, nextStep.manaSpent)
      // process.exit();
    } else {
      bossDamageValue = bossDamage
      if (nextStep.currentEffect && nextStep.currentEffect.has('shield')) {
        bossDamageValue =
          bossDamage - nextStep.currentEffect.get('shield').armor < 1
            ? 1
            : bossDamage - nextStep.currentEffect.get('shield').armor
      }

      armor = 0
      if (nextStep.currentEffect && nextStep.currentEffect.has('shield')) {
        armor = nextStep.currentEffect.get('shield').armor
      }

      // console.log('-- Boss turn --');
      // console.log(`- Player has ${nextStep.hitPoints} hit points, ${armor} armor, ${nextStep.mana} mana`);
      // console.log(`- Boss has ${nextStep.bossHitPoints} hit points`);

      if (nextStep.currentEffect.size) {
        // console.log('has effects');
        for (var effect of Array.from(nextStep.currentEffect)) {
          // console.log(effect[1]);
          // effect[1].damage && console.log(`${effect[1].name} deals ${effect[1].damage} damage! ${effect[1].effect - 1} turns left`);
          nextStep.bossHitPoints -= effect[1].damage
          // effect[1].mana && console.log(`${effect[1].name} granted ${effect[1].mana} mana! ${effect[1].effect - 1} turns left`);
          nextStep.mana += effect[1].mana
          // effect[1].armor && console.log(`${effect[1].name} granted ${effect[1].armor} armor! ${effect[1].effect - 1} turns left`);
          effect[1].effect--
          if (effect[1].effect === 0) {
            nextStep.currentEffect.delete(effect[0])
          }
        }
      }

      if (nextStep.bossHitPoints <= 0) {
        // console.log('Player win!', nextStep.manaSpent, nextStep.mana, '\n');
        // process.exit();
        min = Math.min(min, nextStep.manaSpent)
      } else {
        // console.log(`Boss attacks for ${bossDamageValue} damage! Hit points left: ${nextStep.hitPoints - bossDamageValue}`);
        // console.log('');

        nextStep.hitPoints -= bossDamageValue

        if (nextStep.hitPoints <= 0) {
          // console.log('Player loose\n');
        } else {
          explore(nextStep)
        }
      }
    }
  }
}

explore({
  mana: mana,
  manaSpent: 0,
  hitPoints: hitPoints,
  bossHitPoints: bossHitPoints
})

console.log(min)
