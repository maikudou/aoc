/* eslint-disable complexity */
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var sats = [];

lineReader.on('line', function(line) {
    const [, x, y, z] = /^<x=(-?\d+), y=(-?\d+), z=(-?\d+)>$/.exec(line);
    sats.push({
        velocity: {
            x: 0,
            y: 0,
            z: 0
        },
        x: parseInt(x, 10),
        y: parseInt(y, 10),
        z: parseInt(z, 10)
    });
});

function setVel(a, b) {
    a.velocity.x += a.x < b.x ? 1 : a.x > b.x ? -1 : 0;
    b.velocity.x += a.x < b.x ? -1 : a.x > b.x ? 1 : 0;

    a.velocity.y += a.y < b.y ? 1 : a.y > b.y ? -1 : 0;
    b.velocity.y += a.y < b.y ? -1 : a.y > b.y ? 1 : 0;

    a.velocity.z += a.z < b.z ? 1 : a.z > b.z ? -1 : 0;
    b.velocity.z += a.z < b.z ? -1 : a.z > b.z ? 1 : 0;
}

function setPos(a) {
    a.x += a.velocity.x;
    a.y += a.velocity.y;
    a.z += a.velocity.z;
}

function potential(a) {
    return Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z);
}

function kinetic(a) {
    return Math.abs(a.velocity.x) + Math.abs(a.velocity.y) + Math.abs(a.velocity.z);
}

lineReader.on('close', function() {
    for (var i = 0; i < 1000; i++) {
        // 1 - 2,
        setVel(sats[0], sats[1]);
        // 1 - 3,
        setVel(sats[0], sats[2]);
        // 1 - 4,
        setVel(sats[0], sats[3]);
        // 2 - 3,
        setVel(sats[1], sats[2]);
        // 2 - 4,
        setVel(sats[1], sats[3]);
        // 3 - 4
        setVel(sats[2], sats[3]);

        setPos(sats[0]);
        setPos(sats[1]);
        setPos(sats[2]);
        setPos(sats[3]);
    }

    // console.log(sats);
    console.log(sats.reduce((acc, sat) => {
        return acc + potential(sat) * kinetic(sat);
    }, 0));
});
