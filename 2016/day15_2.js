var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(`${__dirname}/day15.input`)
});

const disks = [];

lineReader.on('line', function(line) {
    const [, posCount, pos] = /has (\d+).*position (\d+)/.exec(line);
    disks.push({ posCount, pos });
});

function cloneState(disks) {
    var state = [];
    for (var i = 0; i < disks.length; i++) {
        state.push(Object.assign({}, disks[i]));
    }
    return state;
}

const states = [];

function rotate(state, currentTime) {
    // console.log('rotate', currentTime, states);
    if (states[currentTime + 1]) {
        return cloneState(states[currentTime + 1]);
    }
    for (var i = 0; i < state.length; i++) {
        state[i].pos = ++state[i].pos == state[i].posCount ? 0 : state[i].pos; // eslint-disable-line
    }
    states[currentTime + 1] = cloneState(state);
    return cloneState(states[currentTime + 1]);
}

lineReader.on('close', function() {
    var success = false;
    var waitTime = -1;
    var currentTime = 0;
    var ballPosition = 0;
    var state;

    disks.push({ posCount: 11, pos: 0 });

    states[0] = cloneState(disks);

    while (!success) {
        waitTime++;
        ballPosition = 0;
        currentTime = waitTime;

        state = cloneState(states[currentTime] || disks);

        while (true) { // eslint-disable-line
            state = rotate(state, currentTime);
            if (state[ballPosition].pos === 0) {
                ballPosition++;
                if (ballPosition === disks.length) {
                    success = true;
                    break;
                }
            } else {
                break;
            }

            currentTime++;
        }
    }
    // console.log(states);
    console.log(waitTime);
});
