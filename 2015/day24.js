const packages = [
    1,
    3,
    5,
    11,
    13,
    17,
    19,
    23,
    29,
    31,
    37,
    41,
    43,
    47,
    53,
    59,
    67,
    71,
    73,
    79,
    83,
    89,
    97,
    101,
    103,
    107,
    109,
    113
];

// const packages = [
//     1,
//     2,
//     3,
//     4,
//     5,
//     7,
//     8,
//     9,
//     10,
//     11
// ];

const sum = packages.reduce(function(acc, value) {
    return acc += value;
}, 0);

const groupWeight = sum / 3;
console.log(groupWeight);

var variants = new Map();
var newVariants;

for (var i = 0; i < packages.length; i++) {
    const set = new Set();
    set.add(packages[i]);
    variants.set(String(packages[i]), set);
}

var minLength = Infinity;
var variantsArray = Array.from(variants);
var minLengthFound = false;

while (!minLengthFound) {
    variantsArray = Array.from(variants);
    // console.log(variants);
    for (var variant of variantsArray) {
        var runningSum = Array.from(variant[1]).reduce(function(acc, value) {
            return acc + value;
        }, 0);
        if (runningSum === groupWeight) {
            minLength = variant[1].size;
            minLengthFound = true;
        }
    }
    if (minLengthFound) {
        break;
    }
    newVariants = new Map();
    for (var k = 0; k < variantsArray.length; k++) {
        for (var l = 0; l < packages.length; l++) {
            var currentPackage = packages[l];
            // console.log(variantsArray[k][1]);
            if (!variantsArray[k][1].has(currentPackage)) {
                var runningSum2 = Array.from(variantsArray[k][1]).reduce(function(acc, value) {
                    return acc + value;
                }, 0);
                var id = variantsArray[k][0].split('|');
                id.push(currentPackage);
                id = id.sort(function(a, b) {
                    return a === b ? 0 : a < b ? -1 : 1;
                }).join('|');
                if (runningSum2 + currentPackage <= groupWeight
                    && !newVariants.has(id)) {
                    // console.log(variantsArray[k][1]);
                    // variantsArray[k][1].add(currentPackage);
                    // console.log(variantsArray[k][1]);
                    const set = new Set(Array.from(variantsArray[k][1]));
                    set.add(currentPackage);
                    // console.log(set);
                    newVariants.set(id, set);
                }
            }
        }
    }
    variants = newVariants;
}

variantsArray = Array.from(variants);

var minQE = Infinity;

for (var variant of variantsArray) {
    var runningSum = Array.from(variant[1]).reduce(function(acc, value) {
        return acc + value;
    }, 0);
    if (runningSum === groupWeight) {
        minQE = Math.min(minQE, Array.from(variant[1]).reduce(function(acc, value) {
            return acc * value;
        }, 1));
    }
}

// console.log(variants);

console.log(minLength);
console.log(minQE);
