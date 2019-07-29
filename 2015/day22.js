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

for (var i = 0; i < 1000000000; i++) {
    hitPoints = 50;
    mana = 500;
    bossHitPoints = 55;
    playersTurn = true;
    manaSpent = 0;
    ongoingSpells = new Map();
    successLogs = [];

    while (hitPoints > 0 && bossHitPoints > 0) {
        ongoingSpellsArray = Array.from(ongoingSpells);
        var spell;
        var armor = 0;

        var logs = [];

        successLogs.push(playersTurn ? '-- Player turn --' : '-- Boss turn --');
        successLogs.push(`- Player has ${hitPoints} hit points, ${armor} armor, ${mana} mana`);
        successLogs.push(`- Boss has ${bossHitPoints} hit points`);

        for (var j = 0; j < ongoingSpellsArray.length; j++) {
            spell = ongoingSpellsArray[j];
            switch (true) {
                case Boolean(spell[1].damage):
                    bossHitPoints -= spell[1].damage;
                    logs.push(`${spell[0]} deals ${spell[1].damage} damage! ${spell[1].effect - 1} turns left`);
                    break;
                case Boolean(spell[1].heal):
                    hitPoints += spell[1].heal;
                    logs.push(`${spell[0]} heals for ${spell[1].heal} poins! ${spell[1].effect - 1} turns left`);
                    break;
                case Boolean(spell[1].armor > 0):
                    armor = spell[1].armor;
                    logs.push(`${spell[0]} granted ${spell[1].armor} armor! ${spell[1].effect - 1} turns left`);
                    break;
                case Boolean(spell[1].mana > 0):
                    mana += spell[1].mana;
                    logs.push(`${spell[0]} granted ${spell[1].mana} mana! ${spell[1].effect - 1} turns left`);
                    break;
            }
            spell[1].effect--;
            if (!spell[1].effect) {
                ongoingSpells.delete(spell[0]);
            }
        }
        if (logs.length) {
            successLogs.push(logs.join('\n'));
        }

        if (bossHitPoints <= 0) {
            break;
        }

        if (playersTurn) {
            var availableSpells = getAvailableSpells(mana);
            if (!availableSpells.length) {
                successLogs.push(`Player is out of mana!\n`);
                playersTurn = !playersTurn;
                continue;
            }
            spell = null;
            do {
                spell = availableSpells[Math.floor(Math.random() * availableSpells.length)];
                // successLogs.push(spell);
            } while (ongoingSpells.has(spell.name));
            // successLogs.push(spell);
            if (spell.effect) {
                ongoingSpells.set(spell.name, Object.assign(spell));
                successLogs.push(`Player casts ${spell.name}`);
            } else {
                successLogs.push(
                    `Player casts ${spell.name}`,
                    spell.damage ? `dealing ${spell.damage} damage` : '',
                    spell.heal ? `healing for ${spell.heal} points` : ''
                );
                hitPoints += spell.heal;
                bossHitPoints -= spell.damage;
                mana += spell.mana;
            }
            manaSpent += spell.cost;
            mana -= spell.cost;

        } else {
            hitPoints -= bossDamage - armor < 1 ? 1 : bossDamage - armor;
            if (armor) {
                successLogs.push(`Boss attacks for 8 - ${armor} = ${bossDamage - armor < 1 ? 1 : bossDamage - armor} damage!`);
            } else {
                successLogs.push(`Boss attacks for 8 damage!`);
            }
        }

        playersTurn = !playersTurn;
        successLogs.push('');
    }

    if (hitPoints <= 0 && bossHitPoints) {
        // console.log('Player loose!');
    }

    if (bossHitPoints <= 0 && hitPoints) {
        console.log(successLogs.join('\n'));
        console.log('Player win!');
    }

    if (hitPoints > 0 && mana >= 0) {
        min = Math.min(min, manaSpent);
    }
}

console.log(min);
