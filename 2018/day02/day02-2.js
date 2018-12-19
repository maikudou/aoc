var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

const lines = [];

function getDistance(a, b) {
    const aLength = a.length;
    const bLength = b.length;
    var aIndex = 0;
    var bIndex = 0;
    var distance = 0;
    var common = "";

    while (aIndex < aLength || bIndex < bLength) {
        if (aIndex >= aLength) {
            distance++;
            bIndex++;
            continue;
        }
        if (bIndex >= bLength) {
            distance++;
            aIndex++;
            continue;
        }
        if (a[aIndex] == b[bIndex]) {
            common = common + a[aIndex];
            aIndex++;
            bIndex++;
            continue;
        }
        aIndex++;
        bIndex++;
        distance++;
    }

    return {distance, common};
}

lineReader.on('line', function (line) {
    lines.push(line);
});

lineReader.on('close', function () {
    for (var i = 0; i < lines.length; i++) {
        for (var j = i+1; j < lines.length; j++) {
            if (i == j) {
                continue;
            }
            var { distance, common } = getDistance(lines[i], lines[j]);
            if (distance == 1) {
                console.log(common);
                process.exit(0);
            }
        }
    }
});
