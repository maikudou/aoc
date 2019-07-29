const { createCanvas } = require('canvas');
const { createWriteStream } = require('fs');
const { join } = require('path');

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var xMin = Infinity;
var xMax = - Infinity;
var yMin = Infinity;
var yMax = - Infinity;

const points = [];

lineReader.on('line', function (line) {
    var [_, x, y, Vx, Vy] = /position=<( *\-?\d+), ( *\-?\d+)> velocity=<( *\-?\d+), ( *\-?\d+)>/.exec(line);
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    Vx = parseInt(Vx, 10);
    Vy = parseInt(Vy, 10);
    // console.log(x, y, Vx, Vy);

    xMin = Math.min(x, xMin);
    xMax = Math.max(x, xMax);
    yMin = Math.min(y, yMin);
    yMax = Math.max(y, yMax);

    points.push({x, y, Vx, Vy});
});

lineReader.on('close', function () {
    console.log(Math.abs(xMin - xMax), Math.abs(yMin - yMax));
    // const w = Math.abs(xMin - xMax) * 2;
    // const h =  Math.abs(yMin - yMax) * 2;

    const w = 1000;
    const h = 1000;

    const startX = w/2
    const startY = h/2

    for (var s = 0; s < 100000; s++) {
        var minSX = Infinity;
        var minSY = Infinity;
        var maxSX = -Infinity;
        var maxSY = -Infinity;

        for (var i = 0; i < points.length; i++) {
            minSX = Math.min(minSX, points[i].x);
            minSY = Math.min(minSY, points[i].y);
            maxSX = Math.max(maxSX, points[i].x);
            maxSY = Math.max(maxSY, points[i].y);
            points[i].x += points[i].Vx;
            points[i].y += points[i].Vy;

        }

        if (Math.abs(minSX - maxSX) < 250 && Math.abs(minSY - maxSY) < 250) {
            console.log('CloseEnough', s);
            var canvas = createCanvas(w, h);
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = 'white';
            for (var i = 0; i < points.length; i++) {
                ctx.fillRect(
                    startX + points[i].x,
                    startY + points[i].y,
                    1,
                    1
                );
            }
            var out = createWriteStream(join(__dirname, 'render', `${s}.png`));
            var stream = canvas.createPNGStream();
            stream.pipe(out);
        }

    }

});
