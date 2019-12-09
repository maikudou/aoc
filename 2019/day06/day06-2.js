var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

const tree = new Map();

function dfs(root, count = 0) {
    root.before = count;
    root.after = count;
    for (var i = 0; i < root.orbiters.length; i++) {
        dfs(tree.get(root.orbiters[i]), count + 1);
    }
    for (i = 0; i < root.orbiters.length; i++) {
        root.after = Math.max(root.after, tree.get(root.orbiters[i]).after + 1);
    }
}

lineReader.on('line', function(line) {
    const re = /^(.{1,3})\)(.{1,3})/gi;
    var [, center, orbiter] = re.exec(line);
    if (!tree.has(center)) {
        tree.set(center, {
            orbiters: []
        });
    }
    if (!tree.has(orbiter)) {
        tree.set(orbiter, {
            orbiters: [],
            orbits: center
        });
    }
    tree.get(center).orbiters.push(orbiter);
    tree.get(orbiter).orbits = center;
});

lineReader.on('close', function() {
    dfs(tree.get('COM'));
    var youOrbits = tree.get(tree.get('YOU').orbits);
    var sanOrbits = tree.get(tree.get('SAN').orbits);
    var jumps = 0;
    // console.log(youOrbits, sanOrbits);
    while (sanOrbits.before > youOrbits.before) {
        jumps++;
        sanOrbits = tree.get(sanOrbits.orbits);
    }
    while (sanOrbits.before < youOrbits.before) {
        jumps++;
        youOrbits = tree.get(youOrbits.orbits);
    }
    while (sanOrbits !== youOrbits) {
        sanOrbits = tree.get(sanOrbits.orbits);
        youOrbits = tree.get(youOrbits.orbits);
        jumps += 2;
    }
    console.log(jumps);
});
