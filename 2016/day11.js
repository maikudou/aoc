const test = true;
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + `/day11.${test ? 'test-' : ''}input`)
});

var debug = false;

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
    var moves = new Set();
    var floorGens = generators[floor];
    var floorChips = chips[floor];
    var floorGensArray = Array.from(generators[floor]);
    var floorChipsArray = Array.from(floorChips);
    var newHash;

    // debug && console.log('gpm', generators, floorGensArray, floorChipsArray);

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
            if (floorChips.has(floorGensArray[i])
                && chips[nextFloor].size <= generators[nextFloor].size
            ) {
                var gensClone = cloneFloorData(generators);
                var chipsClone = cloneFloorData(chips);

                gensClone[floor].delete(floorGensArray[i]);
                chipsClone[floor].delete(floorGensArray[i]);

                gensClone[nextFloor].add(floorGensArray[i]);
                chipsClone[nextFloor].add(floorGensArray[i]);

                newHash = createHash(nextFloor, gensClone, chipsClone);

                if (!graph.has(newHash)) {
                    graph.set(newHash, {
                        gens: gensClone,
                        chips: chipsClone,
                        floor: nextFloor,
                        visited: false,
                        distance: distance + 1,
                        from: hash
                    });
                    moves.add(newHash);
                }

            }

            // Single gen
            // Next floor has same chip
            // or next floor is balanced or has more gens than chips
            // and Current floor has not the same chip or current floor does not have any other chips
            if (
                (!floorChips.has(floorGensArray[i]) || floorGens.size === 1)
                && (chips[nextFloor].size === 1 && chips[nextFloor].has(floorGensArray[i])
                    || chips[nextFloor].size <= generators[nextFloor].size
                )
            ) {
                var gensClone = cloneFloorData(generators);
                var chipsClone = cloneFloorData(chips);

                gensClone[floor].delete(floorGensArray[i]);
                gensClone[nextFloor].add(floorGensArray[i]);

                newHash = createHash(nextFloor, gensClone, chipsClone);

                if (!graph.has(newHash)) {
                    graph.set(newHash, {
                        gens: gensClone,
                        chips: chipsClone,
                        floor: nextFloor,
                        visited: false,
                        distance: distance + 1,
                        from: hash
                    });
                    moves.add(newHash);
                }

            }

            // double gen
            for (var j = 0; j < floorGensArray.length; j++) {
                if (j !== i) {
                    if (
                        (chips[nextFloor].has(floorGensArray[i]) && chips[nextFloor].has(floorGensArray[j]) && chips[nextFloor].size === 2
                            || chips[nextFloor].size <= generators[nextFloor].size)
                        && (floorChips.length === 0 || generators[floor].size === 2)
                    ) {
                        var gensClone = cloneFloorData(generators);
                        var chipsClone = cloneFloorData(chips);

                        gensClone[floor].delete(floorGensArray[i]);
                        gensClone[floor].delete(floorGensArray[j]);
                        gensClone[nextFloor].add(floorGensArray[i]);
                        gensClone[nextFloor].add(floorGensArray[j]);

                        newHash = createHash(nextFloor, gensClone, chipsClone);

                        if (!graph.has(newHash)) {
                            graph.set(newHash, {
                                gens: gensClone,
                                chips: chipsClone,
                                floor: nextFloor,
                                visited: false,
                                distance: distance + 1,
                                from: hash
                            });
                            moves.add(newHash);
                        }

                    }
                }
            }
        }


        // chips
        for (var k = 0; k < floorChipsArray.length; k++) {
            // Single chip
            if (generators[nextFloor].has(floorChipsArray[k])
                || generators[nextFloor].size === 0
            ) {
                var gensClone = cloneFloorData(generators);
                var chipsClone = cloneFloorData(chips);

                chipsClone[floor].delete(floorChipsArray[k]);
                chipsClone[nextFloor].add(floorChipsArray[k]);

                newHash = createHash(nextFloor, gensClone, chipsClone);

                if (!graph.has(newHash)) {
                    graph.set(newHash, {
                        gens: gensClone,
                        chips: chipsClone,
                        floor: nextFloor,
                        visited: false,
                        distance: distance + 1,
                        from: hash
                    });
                    moves.add(newHash);
                }

            }

            // Double chips
            for (var l = 0; l < floorChipsArray.length; l++) {

                debug && console.log(nextFloor, generators[nextFloor], generators[nextFloor].size);

                if (l !== k && generators[nextFloor].has(floorChipsArray[k]) && generators[nextFloor].has(floorChipsArray[l])
                    || generators[nextFloor].size === 0
                ) {
                    var gensClone = cloneFloorData(generators);
                    var chipsClone = cloneFloorData(chips);

                    chipsClone[floor].delete(floorChipsArray[k]);
                    chipsClone[floor].delete(floorChipsArray[l]);
                    chipsClone[nextFloor].add(floorChipsArray[k]);
                    chipsClone[nextFloor].add(floorChipsArray[l]);

                    newHash = createHash(nextFloor, gensClone, chipsClone);

                    if (!graph.has(newHash)) {
                        graph.set(newHash, {
                            gens: gensClone,
                            chips: chipsClone,
                            floor: nextFloor,
                            visited: false,
                            distance: distance + 1,
                            from: hash
                        });
                        moves.add(newHash);
                    }

                }
            }
        }
    }

    return Array.from(moves);
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

// function exploreToSolution(hash) {
//     var currentNode = graph.get(hash);
//     if (currentNode.gens[3].size === typesLenght && currentNode.chips[3].size === typesLenght) {
//         return currentNode;
//     }
//     var nextMoves = getPossibleMoves(hash);
//     for (var i = 0; i < nextMoves.length; i++) {
//         var solution = exploreToSolution(nextMoves[i]);
//         if (solution) {
//             return solution;
//         }
//     }
//     return null;
// }

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
    // console.log(gens);
    // console.log(chips);
    // console.log(typesLenght);
    var startHash = createHash(currentFloor, gens, chips);
    // console.log('startHash', startHash);
    graph.set(startHash, {
        gens: cloneFloorData(gens),
        chips: cloneFloorData(chips),
        floor: 0,
        visited: false,
        distance: 0
    });

    var done = false;

    var timer = Date.now();
    var toExplore = [startHash];
    var currentNode;

    // BFS
    while (toExplore.length && !done) {
        var hash = toExplore.shift();
        // console.log(graph.size, toExplore.length, hash);
        currentNode = graph.get(hash);
        // console.log(createHash(currentNode.floor, currentNode.gens, currentNode.chips));
        // logState(currentNode);
        if (!currentNode.visited) {
            currentNode.visited = true;
            if (currentNode.gens[3].size === typesLenght && currentNode.chips[3].size === typesLenght) {
                done = true;
                // process.exit(0);
            } else {
                var nextMoves = getPossibleMoves(hash);
                for (var i = 0; i < nextMoves.length; i++) {
                    toExplore.push(nextMoves[i]);
                }
            }
        }
    }

    if (done) {
        console.log(`${currentNode.distance} steps — ${Date.now() - timer}ms`);
        if (test) {
            var from = currentNode.from;
            var solution = [];

            while (from) {
                solution.unshift(from);
                from = graph.get(from).from;
            }

            solution.push(createHash(3, currentNode.gens, currentNode.chips));

            for (var i = 0; i < solution.length; i++) {
                console.log(solution[i]);
                logState(graph.get(solution[i]));
            }
        }
    } else {
        console.log('Solution not found');
    }

    // // DFS
    // console.log(`${exploreToSolution(startHash).distance} steps — ${Date.now() - timer}ms`);

    // debug = true;

    // console.log('moves', getPossibleMoves('2|---hydrogen,lithium|--hydrogen,lithium-'));

    // console.log(getPossibleMoves(currentFloor, gens, chips, 0));
});
