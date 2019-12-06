var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/day4.input')
});

const realRooms = [];

lineReader.on('line', function(line) {
    const [, name, sectorId, checksum] = /^([a-z-]+)-(\d+)\[(.+)\]$/.exec(line);
    const clearNameArray = name.replace(/[^a-z]/g, '').split('');
    var usage = new Map();
    for (var i = 0; i < clearNameArray.length; i++) {
        if (usage.has(clearNameArray[i])) {
            usage.set(clearNameArray[i], usage.get(clearNameArray[i]) + 1);
        } else {
            usage.set(clearNameArray[i], 1);
        }
    }

    usage = Array.from(usage);

    usage.sort(function(a, b) {
        if (a[1] > b[1]) {
            return -1;
        } else if (a[1] < b[1]) {
            return 1;
        } else if (a[0] > b[0]) {
            return 1;
        } else if (a[0] < b[0]) {
            return -1;
        } else {
            return 0;
        }
    });

    var calculatedChecksum = usage.slice(0, 5).map(value => value[0]).join('');
    if (calculatedChecksum === checksum) {
        realRooms.push({
            name,
            sectorId: parseInt(sectorId, 10)
        });
    }

});

lineReader.on('close', function() {
    console.log(realRooms.reduce(function(acc, value) {
        return acc + value.sectorId;
    }, 0));
});
