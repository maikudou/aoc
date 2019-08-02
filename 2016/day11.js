var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/day11.test-input')
});

var debug = false;

function createHash(floor, generators, chips) {
    var hash = [floor];

    hash.push(generators.reduce(function(acc, floorGens) {
        acc.push(Array.from(floorGens).sort().reduce(function(acc2, generator) {
            acc2.push(generator);
            return acc2;
        }, []).join(','));
        return acc;
    }, []).join('-'));

    hash.push(chips.reduce(function(acc, floorChips) {
        acc.push(Array.from(floorChips).sort().reduce(function(acc2, chip) {
            acc2.push(chip);
            return acc2;
        }, []).join(','));
        return acc;
    }, []).join('-'));

    return hash.join('|');
}

const gens = [new Set(), new Set(), new Set(), new Set()];
const chips = [new Set(), new Set(), new Set(), new Set()];
var currentFloor = 0;

const graph = new Map();

function getPossibleMoves(hash) { // eslint-disable-line
    const node = graph.get(hash);
    const floor = node.floor;
    const generators = node.gens;
    const chips = node.chips;
    const distance = node.distance;
    var moves = [];
    var floorGens = Array.from(generators[floor]);
    var floorChips = Array.from(chips[floor]);

    const floorsVariants = [];
    if (floor > 0) {
        floorsVariants.push(floor - 1);
    }
    if (floor < 3) {
        floorsVariants.push(floor + 1);
    }

    for (var f = 0; f < floorsVariants.length; f++) {
        var nextFloor = floorsVariants[f];

        for (var i = 0; i < floorGens.length; i++) {
            // chip-gen group
            if (chips[floor].has(floorGens[i])
                && (chips[nextFloor].size === 0 || chips[nextFloor].size <= generators[nextFloor].size)
            ) {
                var gensClone = cloneFloorData(generators);
                var chipsClone = cloneFloorData(chips);

                gensClone[floor].delete(floorGens[i]);
                chipsClone[floor].delete(floorGens[i]);

                gensClone[nextFloor].add(floorGens[i]);
                chipsClone[nextFloor].add(floorGens[i]);

                var hash = createHash(nextFloor, gensClone, chipsClone);

                if (!graph.has(hash)) {
                    graph.set(hash, {
                        gens: gensClone,
                        chips: chipsClone,
                        floor: nextFloor,
                        visited: false,
                        distance: distance + 1
                    });
                }

                moves.push(hash);
            }

            // Single gen
            // Next floor has same chip
            // or Current floor has same chip and current floor does not have any gens
            // or next floor does not have any chips
            // or next floor is balanced or has more gens than chips
            if ((chips[nextFloor].has(floorGens[i])
                || chips[nextFloor].size === 0
                || chips[nextFloor].size <= generators[nextFloor].size)
                    && chips[floor].has(floorGens[i]) && generators[floor].size === 1
            ) {
                var gensClone = cloneFloorData(generators);
                var chipsClone = cloneFloorData(chips);

                gensClone[floor].delete(floorGens[i]);
                gensClone[nextFloor].add(floorGens[i]);

                var hash = createHash(nextFloor, gensClone, chipsClone);

                if (!graph.has(hash)) {
                    graph.set(hash, {
                        gens: gensClone,
                        chips: chipsClone,
                        floor: nextFloor,
                        visited: false,
                        distance: distance + 1
                    });
                }

                moves.push(hash);
            }

            // double gen
            for (var j = 0; j < floorGens.length; j++) {
                if (j !== i) {
                    if ((chips[nextFloor].has(floorGens[i]) && chips[nextFloor].has(floorGens[j])
                        || chips[nextFloor].size === 0
                        || chips[nextFloor].size <= generators[nextFloor].size)
                            && (chips[floor].length === 0 || generators[floor].size === 2)
                    ) {
                        var gensClone = cloneFloorData(generators);
                        var chipsClone = cloneFloorData(chips);

                        gensClone[floor].delete(floorGens[i]);
                        gensClone[floor].delete(floorGens[j]);
                        gensClone[nextFloor].add(floorGens[i]);
                        gensClone[nextFloor].add(floorGens[j]);

                        var hash = createHash(nextFloor, gensClone, chipsClone);

                        if (!graph.has(hash)) {
                            graph.set(hash, {
                                gens: gensClone,
                                chips: chipsClone,
                                floor: nextFloor,
                                visited: false,
                                distance: distance + 1
                            });
                        }

                        moves.push(hash);
                    }
                }
            }
        }

        for (var k = 0; k < floorChips.length; k++) {
            // Single chip
            if (gens[nextFloor].has(floorChips[k])
                || gens[nextFloor].size === 0
            ) {
                var gensClone = cloneFloorData(generators);
                var chipsClone = cloneFloorData(chips);

                chipsClone[floor].delete(floorChips[k]);
                chipsClone[nextFloor].add(floorChips[k]);

                var hash = createHash(nextFloor, gensClone, chipsClone);

                if (!graph.has(hash)) {
                    graph.set(hash, {
                        gens: gensClone,
                        chips: chipsClone,
                        floor: nextFloor,
                        visited: false,
                        distance: distance + 1
                    });
                }

                moves.push(hash);
            }

            // Double chips
            for (var l = 0; l < floorChips.length; l++) {

                debug && console.log(nextFloor, gens[nextFloor], gens[nextFloor].size);

                if (l !== k && gens[nextFloor].has(floorChips[k]) && gens[nextFloor].has(floorChips[l])
                    || gens[nextFloor].size === 0
                ) {
                    var gensClone = cloneFloorData(generators);
                    var chipsClone = cloneFloorData(chips);

                    chipsClone[floor].delete(floorChips[k]);
                    chipsClone[floor].delete(floorChips[l]);
                    chipsClone[nextFloor].add(floorChips[k]);
                    chipsClone[nextFloor].add(floorChips[l]);

                    var hash = createHash(nextFloor, gensClone, chipsClone);

                    if (!graph.has(hash)) {
                        graph.set(hash, {
                            gens: gensClone,
                            chips: chipsClone,
                            floor: nextFloor,
                            visited: false,
                            distance: distance + 1
                        });
                    }

                    moves.push(hash);
                }
            }
        }
    }

    return moves;
}

function cloneFloorData(data) {
    var arr = [];
    for (var i = 0; i < data.length; i++) {
        arr.push(new Set(Array.from(data[i])));
    }
    return arr;
}

function logState(state) {
    for (var i = 3; i >= 0; i--) {
        console.log(`F${i + 1}  ${state.floor === i ? 'E' : '.'}  ${state.gens[i].has('hydrogen') ? 'HG' : '. ' }  ${state.chips[i].has('hydrogen') ? 'HM' : '. ' }  ${state.gens[i].has('lithium') ? 'LG' : '. ' }  ${state.chips[i].has('lithium') ? 'LM' : '. ' }  `);
    }
    console.log(" ");
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
    console.log(gens);
    console.log(chips);
    console.log(typesLenght);
    var startHash = createHash(currentFloor, gens, chips);
    console.log(startHash);
    graph.set(startHash, {
        gens: cloneFloorData(gens),
        chips: cloneFloorData(chips),
        floor: 0,
        visited: false,
        distance: 0
    });

    var done = false;

    var toExplore = [startHash];

    while (toExplore.length && !done) {
        var hash = toExplore.shift();
        var currentNode = graph.get(hash);
        // console.log(createHash(currentNode.floor, currentNode.gens, currentNode.chips));
        // logState(currentNode);
        if (!currentNode.visited) {
            currentNode.visited = true;
            if (currentNode.gens[3].length === typesLenght && currentNode.chips[3].length === typesLenght) {
                done = true;
                console.log(currentNode.distance);
            } else {
                var nextMoves = getPossibleMoves(hash);
                toExplore = toExplore.concat(nextMoves);
            }
        }
    }

    debug = true;

    console.log(getPossibleMoves('0|--hydrogen,lithium-|hydrogen,lithium---'));

    // console.log(getPossibleMoves(currentFloor, gens, chips, 0));
});
