var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day7.input')
});

var circuit = {};

lineReader.on('line', function(line) {
    var instr = line.split(' -> ');
    var wireName = instr[1];
    var foundNot = null;
    var foundOther = null;

    if (/OR|AND|RSHIFT|LSHIFT|NOT/gi.exec(instr[0])) {
        if (foundNot = /NOT (\S+)/gi.exec(instr[0])) { // eslint-disable-line no-cond-assign
            circuit[wireName] = function() {
                return ~getWire(foundNot[1], 'NOT'); // eslint-disable-line no-bitwise
            };
        }
        if (foundOther = /(\S+) (OR|AND|RSHIFT|LSHIFT) (\S+)/gi.exec(instr[0])) { // eslint-disable-line no-cond-assign
            circuit[wireName] = function() {
                return getResult(foundOther[1], foundOther[3], foundOther[2]);
            };
        }
    } else if (isNaN(parseInt(instr[0], 10))) {
        circuit[wireName] = function() {
            return getWire(instr[0], 'Direct');
        };
    } else {
        circuit[wireName] = parseInt(instr[0], 10);
    }
});

function getResult(left, right, operand) {
    var left, right;
    if (isNaN(parseInt(left, 10))) {
        left = getWire(left, operand);
    } else {
        left = parseInt(left, 10);
    }
    if (isNaN(parseInt(right, 10))) {
        right = getWire(right, operand);
    } else {
        right = parseInt(right, 10);
    }

    var result;

    switch (operand) {
        case 'OR':
            result = left | right; // eslint-disable-line no-bitwise
            break;
        case 'AND':
            result = left & right; // eslint-disable-line no-bitwise
            break;
        case 'LSHIFT':
            result = left << right; // eslint-disable-line no-bitwise
            break;
        case 'RSHIFT':
            result = left >> right; // eslint-disable-line no-bitwise
            break;
    }

    return result;
}

function getWire(wireName,) {
    if (typeof circuit[wireName] === 'function') {
        return circuit[wireName] = circuit[wireName]();
    } else {
        return circuit[wireName];
    }
}

lineReader.on('close', function() {
    console.log(getWire('a'));
});
