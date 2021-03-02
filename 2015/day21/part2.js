var boss = {
  HP: 104,
  damage: 8,
  armor: 1
}

var shop = {
  weapons: [
    {
      name: 'Dagger',
      cost: 8,
      damage: 4,
      armor: 0
    },
    {
      name: 'Shortsword',
      cost: 10,
      damage: 5,
      armor: 0
    },
    {
      name: 'Warhammer',
      cost: 25,
      damage: 6,
      armor: 0
    },
    {
      name: 'Longsword',
      cost: 40,
      damage: 7,
      armor: 0
    },
    {
      name: 'Greataxe',
      cost: 74,
      damage: 8,
      armor: 0
    }
  ],
  armor: [
    {
      name: 'Leather',
      cost: 13,
      damage: 0,
      armor: 1
    },
    {
      name: 'Chainmail',
      cost: 31,
      damage: 0,
      armor: 2
    },
    {
      name: 'Splintmail',
      cost: 53,
      damage: 0,
      armor: 3
    },
    {
      name: 'Bandedmail',
      cost: 75,
      damage: 0,
      armor: 4
    },
    {
      name: 'Platemail',
      cost: 102,
      damage: 0,
      armor: 5
    }
  ],
  rings: [
    {
      name: 'Damage +1',
      cost: 25,
      damage: 1,
      armor: 0
    },
    {
      name: 'Damage +2',
      cost: 50,
      damage: 2,
      armor: 0
    },
    {
      name: 'Damage +3',
      cost: 100,
      damage: 3,
      armor: 0
    },
    {
      name: 'Defense +1',
      cost: 20,
      damage: 0,
      armor: 1
    },
    {
      name: 'Defense +2',
      cost: 40,
      damage: 0,
      armor: 2
    },
    {
      name: 'Defense +3',
      cost: 80,
      damage: 0,
      armor: 3
    }
  ]
}

function playerWins(player, boss) {
  var playersTurn = true
  while (player.HP > 0 && boss.HP > 0) {
    if (playersTurn) {
      if (boss.armor > player.damage) {
        boss.HP--
      } else {
        boss.HP -= player.damage - boss.armor
      }
    } else if (player.armor > boss.damage) {
      player.HP--
    } else {
      player.HP -= boss.damage - player.armor
    }
    playersTurn = !playersTurn
  }
  return player.HP > 0
}

var minimumGold = 10000
var maximumGold = 0

for (var weaponIndex = 0; weaponIndex < shop.weapons.length; weaponIndex++) {
  for (var armorIndex = -1; armorIndex < shop.armor.length; armorIndex++) {
    var damage = shop.weapons[weaponIndex].damage
    var gold = shop.weapons[weaponIndex].cost
    var armor = 0

    if (armorIndex > -1) {
      armor += shop.armor[armorIndex].armor
      gold += shop.armor[armorIndex].cost
    }

    if (
      playerWins(
        { HP: 100, damage: damage, armor: armor },
        { HP: boss.HP, damage: boss.damage, armor: boss.armor }
      )
    ) {
      if (gold < minimumGold) {
        minimumGold = gold
      }
    } else if (gold > maximumGold) {
      maximumGold = gold
    }

    for (var ringIndex = 0; ringIndex < shop.rings.length; ringIndex++) {
      var ringsDamage = damage + shop.rings[ringIndex].damage
      var ringsArmor = armor + shop.rings[ringIndex].armor
      var ringsGold = gold + shop.rings[ringIndex].cost

      if (
        playerWins(
          { HP: 100, damage: ringsDamage, armor: ringsArmor },
          { HP: boss.HP, damage: boss.damage, armor: boss.armor }
        )
      ) {
        if (ringsGold < minimumGold) {
          minimumGold = ringsGold
        }
      } else if (ringsGold > maximumGold) {
        maximumGold = ringsGold
      }

      for (var ringIndex2 = 0; ringIndex2 < shop.rings.length; ringIndex2++) {
        ringsDamage = damage + shop.rings[ringIndex].damage
        ringsArmor = armor + shop.rings[ringIndex].armor
        ringsGold = gold + shop.rings[ringIndex].cost

        if (ringIndex2 !== ringIndex) {
          ringsDamage += shop.rings[ringIndex2].damage
          ringsArmor += shop.rings[ringIndex2].armor
          ringsGold += shop.rings[ringIndex2].cost

          if (
            playerWins(
              { HP: 100, damage: ringsDamage, armor: ringsArmor },
              { HP: boss.HP, damage: boss.damage, armor: boss.armor }
            )
          ) {
            if (ringsGold < minimumGold) {
              minimumGold = ringsGold
            }
          } else if (ringsGold > maximumGold) {
            maximumGold = ringsGold
          }
        }
      }
    }
  }
}
console.log(maximumGold)
