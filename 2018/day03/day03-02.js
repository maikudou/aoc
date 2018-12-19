var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

const fabric = [];

for (var i = 0; i < 1000; i++) {
    fabric[i] = [];
    for (var j = 0; j < 1000; j++) {
        fabric[i].push(new Set());
    }
}

var overlaps = 0;
var claims = new Map();

lineReader.on('line', function (line) {
    line = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/.exec(line);

    line[1] = parseInt(line[1]);
    line[2] = parseInt(line[2]);
    line[3] = parseInt(line[3]);
    line[4] = parseInt(line[4]);
    line[5] = parseInt(line[5]);

    claims.set(line[1], false);

    for (var i = line[2]; i <  line[2] + line[4]; i++) {
        for (var j = line[3]; j < line[3] + line[5]; j++) {
            if (fabric[i][j].size == 1) {
                overlaps++;
            }

            fabric[i][j].add(line[1]);

            if (fabric[i][j].size > 1) {
                var iterator = fabric[i][j].values();
                var next = iterator.next();

                while (next && next.value) {
                    claims.set(next.value, true);
                    next = iterator.next();
                }
            }
        }
    }

});

lineReader.on('close', function () {
    console.log(overlaps);

    var iterator = claims.keys();
    var next = iterator.next();
    while (next && next.value) {
        if (claims.get(next.value) === false) {
            console.log(next.value);
        }
        next = iterator.next();
    }
});
