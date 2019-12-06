var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day14.input')
});

var regexp = /(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\./;

var contenders = [];
var leadingDistance = 0;
var winningPoints = 0;

lineReader.on('line', function(line) {
    var parse = regexp.exec(line);
    contenders.push({
        name: parse[1],
        speed: Number(parse[2]),
        fly: Number(parse[3]),
        rest: Number(parse[4]),
        state: 'running',
        flyingTime: 0,
        restingTime: 0,
        distance: 0,
        points: 0
    });
});

lineReader.on('close', function() {
    for (var time = 0; time < 2503; time++) {
        for (var i = 0; i < contenders.length; i++) {
            var contender = contenders[i];
            if (contender.state === 'running') {
                contender.distance += contender.speed;
                contender.flyingTime++;
                if (contender.flyingTime === contender.fly) {
                    contender.restingTime = 0;
                    contender.flyingTime = 0;
                    contender.state = 'resting';
                }
            } else {
                contender.restingTime++;
                if (contender.restingTime === contender.rest) {
                    contender.restingTime = 0;
                    contender.flyingTime = 0;
                    contender.state = 'running';
                }
            }
            if (contender.distance > leadingDistance) {
                leadingDistance = contender.distance;
            }
        }

        for (i = 0; i < contenders.length; i++) {
            contender = contenders[i];
            if (contender.distance === leadingDistance) {
                contender.points++;
            }
            if (contender.points > winningPoints) {
                winningPoints = contender.points;
            }
        }
    }

    console.log(leadingDistance, winningPoints);
});
