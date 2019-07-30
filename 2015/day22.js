/* eslint-disable complexity */

var bossHitPoints = 55;
const bossDamage = 8;

var hitPoints = 50;
var mana = 500;

const spells = [
    {
        name: 'magicMissile',
        cost: 53,
        damage: 4,
        heal: 0,
        armor: 0,
        mana: 0,
        effect: 0
    }, {
        name: 'drain',
        cost: 73,
        damage: 2,
        heal: 2,
        armor: 0,
        mana: 0,
        effect: 0
    }, {
        name: 'shield',
        cost: 113,
        damage: 0,
        heal: 0,
        armor: 7,
        mana: 0,
        effect: 6
    }, {
        name: 'poison',
        cost: 173,
        damage: 3,
        heal: 0,
        armor: 0,
        mana: 0,
        effect: 6
    }, {
        name: 'recharge',
        cost: 229,
        damage: 0,
        heal: 0,
        armor: 0,
        mana: 101,
        effect: 5
    }
];

var min = Infinity;
var playersTurn = true;
var manaSpent = 0;
var ongoingSpells = new Set();
var ongoingSpellsArray;

function getAvailableSpells(mana) {
    return spells.filter(function(spell) {
        return spell.cost <= mana;
    });
}

var successLogs = [];

playersTurn = true;
successLogs = [];
var nextStep;

function explore(step) {
    var availableSpells = getAvailableSpells(step.mana);
    var nextSpell;
    var bossDamageValue;

    for (var i = 0; i < availableSpells.length; i++) {
        // console.log('-- Player turn --');
        // console.log(`- Player has ${step.hitPoints} hit points, ${step.currentEffect ? step.currentEffect.armor : 0 } armor, ${step.mana} mana`);
        // console.log(`- Boss has ${step.bossHitPoints} hit points`);

        if (step.currentEffect) {
            // step.currentEffect.armor && console.log(`${step.currentEffect.name} granted ${step.currentEffect.armor} armor! ${step.currentEffect.effect - 1} turns left`);
        }

        nextSpell = availableSpells[i];

        var nextStep = Object.assign({}, {
            mana: step.mana - nextSpell.cost,
            manaSpent: step.manaSpent + nextSpell.cost,
            hitPoints: step.hitPoints,
            bossHitPoints: step.bossHitPoints,
            currentEffect: step.currentEffect
                ? new Map(Array.from(step.currentEffect).map(function (effect) {
                    effect[1] = Object.assign({}, effect[1]);
                    return effect;
                }))
                : new Map()
        });


        if (step.currentEffect && step.currentEffect.size) {
            for (var effect of Array.from(step.currentEffect)) {
                // step.currentEffect.damage && console.log(`${step.currentEffect.name} deals ${step.currentEffect.damage} damage! ${step.currentEffect.effect - 1} turns left`);
                nextStep.bossHitPoints -= effect[1].damage;
                // step.currentEffect.mana && console.log(`${step.currentEffect.name} granted ${step.currentEffect.mana} mana! ${step.currentEffect.effect - 1} turns left`);
                nextStep.mana += effect[1].mana;
                nextStep.currentEffect.get(effect[0]).effect--;
                if (nextStep.currentEffect.get(effect[0]).effect === 0) {
                    nextStep.currentEffect.delete(effect[0]);
                }
            }
        }

        // console.log(
        //     `Player casts ${nextSpell.name}`,
        //     nextSpell.damage ? `dealing ${nextSpell.damage} damage` : '',
        //     nextSpell.heal ? `healing for ${nextSpell.heal} points` : ''
        // );

        nextStep.bossHitPoints -= nextSpell.damage;
        nextStep.hitPoints += nextSpell.heal;

        if (nextSpell.effect) {
            if (step.currentEffect && step.currentEffect.has(nextSpell.name)) {
                continue;
            } else {
                nextStep.currentEffect.set(nextSpell.name, Object.assign(nextSpell));
            }
        }

        if (nextStep.bossHitPoints <= 0) {
            console.log('Player win!', nextStep.manaSpent, nextStep.mana, '\n');
            min = Math.min(min, nextStep.manaSpent);
        } else {
            bossDamageValue = bossDamage;

            if (nextStep.currentEffect) {
                bossDamageValue = bossDamage - nextStep.currentEffect.armor < 1
                    ? 1
                    : bossDamage - nextStep.currentEffect.armor;
            }


            // console.log('-- Boss turn --');
            // console.log(`- Player has ${nextStep.hitPoints} hit points, ${nextStep.currentEffect ? nextStep.currentEffect.armor : 0 } armor, ${nextStep.mana} mana`);
            // console.log(`- Boss has ${nextStep.bossHitPoints} hit points`);

            if (nextStep.currentEffect.size) {
                for (var effect of Array.from(nextStep.currentEffect)) {
                    // step.currentEffect.damage && console.log(`${step.currentEffect.name} deals ${step.currentEffect.damage} damage! ${step.currentEffect.effect - 1} turns left`);
                    nextStep.bossHitPoints -= effect[1].damage;
                    // step.currentEffect.mana && console.log(`${step.currentEffect.name} granted ${step.currentEffect.mana} mana! ${step.currentEffect.effect - 1} turns left`);
                    nextStep.mana += effect[1].mana;
                    nextStep.currentEffect.get(effect[0]).effect--;
                    if (nextStep.currentEffect.get(effect[0]).effect === 0) {
                        nextStep.currentEffect.delete(effect[0]);
                    }
                }
            }

            if (nextStep.bossHitPoints <= 0) {
                console.log('Player win!', nextStep.manaSpent, nextStep.mana, '\n');
                min = Math.min(min, nextStep.manaSpent);
            } else {
                // console.log(`Boss attacks for ${bossDamageValue} damage!`);
                // console.log('');

                nextStep.hitPoints -= bossDamageValue;

                if (nextStep.hitPoints <= 0) {
                    // console.log('Player loose\n');
                } else {
                    explore(nextStep);
                }
            }
        }
    }
}

explore({
    mana: 250, // mana,
    manaSpent: 0,
    hitPoints: 10, // hitPoints,
    bossHitPoints: 13 // bossHitPoints
});

// while (nextSteps.length) {
//     if (playersTurn) {
//         nextStep = nextStep.shift();
//     }

//     successLogs.push(playersTurn ? '-- Player turn --' : '-- Boss turn --');
//     successLogs.push(`- Player has ${hitPoints} hit points, ${armor} armor, ${mana} mana`);
//     successLogs.push(`- Boss has ${bossHitPoints} hit points`);

//     for (var j = 0; j < ongoingSpellsArray.length; j++) {
//         spell = ongoingSpellsArray[j];
//         switch (true) {
//             case Boolean(spell[1].damage):
//                 bossHitPoints -= spell[1].damage;
//                 logs.push(`${spell[0]} deals ${spell[1].damage} damage! ${spell[1].effect - 1} turns left`);
//                 break;
//             case Boolean(spell[1].heal):
//                 hitPoints += spell[1].heal;
//                 logs.push(`${spell[0]} heals for ${spell[1].heal} poins! ${spell[1].effect - 1} turns left`);
//                 break;
//             case Boolean(spell[1].armor > 0):
//                 armor = spell[1].armor;
//                 logs.push(`${spell[0]} granted ${spell[1].armor} armor! ${spell[1].effect - 1} turns left`);
//                 break;
//             case Boolean(spell[1].mana > 0):
//                 mana += spell[1].mana;
//                 logs.push(`${spell[0]} granted ${spell[1].mana} mana! ${spell[1].effect - 1} turns left`);
//                 break;
//         }
//         spell[1].effect--;
//         if (!spell[1].effect) {
//             ongoingSpells.delete(spell[0]);
//         }
//     }
//     if (logs.length) {
//         successLogs.push(logs.join('\n'));
//     }

//     if (bossHitPoints <= 0) {
//         break;
//     }

//     if (playersTurn) {
//         var availableSpells = getAvailableSpells(mana);
//         if (!availableSpells.length) {
//             successLogs.push(`Player is out of mana!\n`);
//             playersTurn = !playersTurn;
//             continue;
//         }
//         spell = null;
//         do {
//             spell = availableSpells[Math.floor(Math.random() * availableSpells.length)];
//             // successLogs.push(spell);
//         } while (ongoingSpells.has(spell.name));
//         // successLogs.push(spell);
//         if (spell.effect) {
//             ongoingSpells.set(spell.name, Object.assign(spell));
//             successLogs.push(`Player casts ${spell.name}`);
//         } else {
//             successLogs.push(
//                 `Player casts ${spell.name}`,
//                 spell.damage ? `dealing ${spell.damage} damage` : '',
//                 spell.heal ? `healing for ${spell.heal} points` : ''
//             );
//             hitPoints += spell.heal;
//             bossHitPoints -= spell.damage;
//             mana += spell.mana;
//         }
//         manaSpent += spell.cost;
//         mana -= spell.cost;

//     } else {
//         hitPoints -= bossDamage - armor < 1 ? 1 : bossDamage - armor;
//         if (armor) {
//             successLogs.push(`Boss attacks for 8 - ${armor} = ${bossDamage - armor < 1 ? 1 : bossDamage - armor} damage!`);
//         } else {
//             successLogs.push(`Boss attacks for 8 damage!`);
//         }
//     }

//     playersTurn = !playersTurn;
//     successLogs.push('');
// }

// if (hitPoints <= 0 && bossHitPoints) {
//     // console.log('Player loose!');
// }

// if (bossHitPoints <= 0 && hitPoints) {
//     console.log(successLogs.join('\n'));
//     console.log('Player win!');
// }

// if (hitPoints > 0 && mana >= 0) {
//     min = Math.min(min, manaSpent);
// }

console.log(min);
