const test = false;
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + `/day11${test ? '.test-' : '_2.'}input`)
});

function createHash(floor, generators, chips) {
    const hashArray = [floor];

    hashArray.push(generators.reduce(function(acc, floorGenerators) {
        acc.push(Array.from(floorGenerators).sort().reduce(function(acc2, generator) {
            acc2.push(generator);
            return acc2;
        }, []).join(','));
        return acc;
    }, []).join('-'));

    hashArray.push(chips.reduce(function(acc, floorChips) {
        acc.push(Array.from(floorChips).sort().reduce(function(acc2, chip) {
            acc2.push(chip);
            return acc2;
        }, []).join(','));
        return acc;
    }, []).join('-'));

    return hashArray.join('|');
}

function createNodeFromHash(hash) {
    var [floor, gens, chips] = hash.split('|');
    gens = gens.split('-').map((gensFloor) => {
        gensFloor = gensFloor.split(',');
        return new Set(gensFloor.length > 1 || gensFloor[0] !== '' ? gensFloor : []);
    });
    chips = chips.split('-').map((chipsFloor) => {
        chipsFloor = chipsFloor.split(',');
        return new Set(chipsFloor.length > 1 || chipsFloor[0] !== '' ? chipsFloor : []);
    });
    return {
        floor: parseInt(floor, 10),
        gens,
        chips
    };
}

const gens = [new Set(), new Set(), new Set(), new Set()];
const chips = [new Set(), new Set(), new Set(), new Set()];
var currentFloor = 0;

const distances = new Map();
const visited = new Set();

function rowIsValid(genRow, chipRow) {
    if (genRow.size === 0 || chipRow.size === 0) {
        return true;
    }
    if (genRow.size) {
        var chipArray = Array.from(chipRow);
        for (var i = 0; i < chipArray.length; i++) {
            if (!genRow.has(chipArray[i])) {
                return false;
            }
        }
    }
    return true;
}

function getPossibleMoves(hash) { // eslint-disable-line
    const node = createNodeFromHash(hash);
    const floor = node.floor;
    const generators = node.gens;
    const chips = node.chips;
    const distance = distances.get(hash);
    var moves = new Set();
    var floorGensArray = Array.from(generators[floor]);
    var floorChipsArray = Array.from(chips[floor]);
    var newHash;

    const floorsVariants = [];
    if (floor > 0) {
        floorsVariants.push(floor - 1);
    }
    if (floor < 3) {
        floorsVariants.push(floor + 1);
    }

    for (var f = 0; f < floorsVariants.length; f++) {
        var nextFloor = floorsVariants[f];

        // gens
        for (var i = 0; i < floorGensArray.length; i++) {

            // chip-gen group
            if (chips[floor].has(floorGensArray[i])) {
                generators[floor].delete(floorGensArray[i]);
                chips[floor].delete(floorGensArray[i]);
                generators[nextFloor].add(floorGensArray[i]);
                chips[nextFloor].add(floorGensArray[i]);

                if (rowIsValid(generators[floor], chips[floor])
                    && rowIsValid(generators[nextFloor], chips[nextFloor])) {
                    newHash = createHash(nextFloor, generators, chips);

                    if (!distances.has(newHash)) {
                        distances.set(newHash, distance + 1);
                        moves.add(newHash);
                    }
                }
                generators[floor].add(floorGensArray[i]);
                chips[floor].add(floorGensArray[i]);
                generators[nextFloor].delete(floorGensArray[i]);
                chips[nextFloor].delete(floorGensArray[i]);
            }

            // Single gen
            generators[floor].delete(floorGensArray[i]);
            generators[nextFloor].add(floorGensArray[i]);

            if (rowIsValid(generators[floor], chips[floor])
                && rowIsValid(generators[nextFloor], chips[nextFloor])) {
                newHash = createHash(nextFloor, generators, chips);

                if (!distances.has(newHash)) {
                    distances.set(newHash, distance + 1);
                    moves.add(newHash);
                }
            }
            generators[floor].add(floorGensArray[i]);
            generators[nextFloor].delete(floorGensArray[i]);

            // double gens
            for (var j = 0; j < floorGensArray.length; j++) {
                if (j !== i) {
                    generators[floor].delete(floorGensArray[i]);
                    generators[floor].delete(floorGensArray[j]);
                    generators[nextFloor].add(floorGensArray[i]);
                    generators[nextFloor].add(floorGensArray[j]);

                    if (rowIsValid(generators[floor], chips[floor])
                        && rowIsValid(generators[nextFloor], chips[nextFloor])) {
                        newHash = createHash(nextFloor, generators, chips);

                        if (!distances.has(newHash)) {
                            distances.set(newHash, distance + 1);
                            moves.add(newHash);
                        }
                    }
                    generators[floor].add(floorGensArray[i]);
                    generators[floor].add(floorGensArray[j]);
                    generators[nextFloor].delete(floorGensArray[i]);
                    generators[nextFloor].delete(floorGensArray[j]);
                }
            }
        }


        // chips
        for (var k = 0; k < floorChipsArray.length; k++) {
            // Single chip
            chips[floor].delete(floorChipsArray[k]);
            chips[nextFloor].add(floorChipsArray[k]);

            if (rowIsValid(generators[floor], chips[floor])
                && rowIsValid(generators[nextFloor], chips[nextFloor])) {
                newHash = createHash(nextFloor, generators, chips);

                if (!distances.has(newHash)) {
                    distances.set(newHash, distance + 1);
                    moves.add(newHash);
                }
            }
            chips[floor].add(floorChipsArray[k]);
            chips[nextFloor].delete(floorChipsArray[k]);

            // Double chips
            for (var l = 0; l < floorChipsArray.length; l++) {
                if (l !== k) {
                    chips[floor].delete(floorChipsArray[k]);
                    chips[floor].delete(floorChipsArray[l]);
                    chips[nextFloor].add(floorChipsArray[k]);
                    chips[nextFloor].add(floorChipsArray[l]);

                    if (rowIsValid(generators[floor], chips[floor])
                        && rowIsValid(generators[nextFloor], chips[nextFloor])) {
                        newHash = createHash(nextFloor, generators, chips);

                        if (!distances.has(newHash)) {
                            distances.set(newHash, distance + 1);
                            moves.add(newHash);
                        }
                    }
                    chips[floor].add(floorChipsArray[k]);
                    chips[floor].add(floorChipsArray[l]);
                    chips[nextFloor].delete(floorChipsArray[k]);
                    chips[nextFloor].delete(floorChipsArray[l]);
                }
            }
        }
    }
    return Array.from(moves);
}

var typesLenght = 0;

lineReader.on('line', function(line) {
    var match;
    var regexp = /([^-\s]+)(?:-compatible)? (generator|microchip)/g;
    while (match = regexp.exec(line)) { // eslint-disable-line
        if (match[2] === 'generator') {
            gens[currentFloor].add(match[1]);
            typesLenght++;
        } else {
            chips[currentFloor].add(match[1]);
        }
    }
    currentFloor++;
});

lineReader.on('close', function() {
    currentFloor = 0;
    var startHash = createHash(currentFloor, gens, chips);
    // console.log(createNodeFromHash(startHash));

    distances.set(startHash, 0);

    var done = false;

    var timer = Date.now();
    var toExplore = [startHash];
    var currentNode;
    var hash;

    // BFS
    while (toExplore.length && !done) {
        hash = toExplore.shift();
        if (!visited.has(hash)) {
            currentNode = createNodeFromHash(hash);
            visited.add(hash);
            if (currentNode.gens[3].size === typesLenght && currentNode.chips[3].size === typesLenght) {
                done = true;
            } else {
                var nextMoves = getPossibleMoves(hash);
                for (var i = 0; i < nextMoves.length; i++) {
                    toExplore.push(nextMoves[i]);
                }
            }
        }
    }

    if (done) {
        console.log(`${distances.get(hash)} steps — ${Date.now() - timer}ms`);
    } else {
        console.log('Solution not found');
    }
});
