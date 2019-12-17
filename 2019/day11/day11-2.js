/* eslint-disable complexity */
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(__dirname + '/input')
});

var input;

lineReader.on('line', function(line) {
    input = line.split(',').map(value => parseInt(value, 10));
});

lineReader.on('close', function() {
    const IntCode = require('../intcode');
    var tick = false;
    var map = new Map();
    var x = 0;
    var y = 0;
    var direction = 'N';
    var cpu = new IntCode(value => {
        if (tick) {
            // rotate
            switch (direction) {
                case 'N':
                    if (value) {
                        direction = 'E';
                        x++;
                    } else {
                        direction = 'W';
                        x--;
                    }
                    break;
                case 'E':
                    if (value) {
                        direction = 'S';
                        y++;
                    } else {
                        direction = 'N';
                        y--;
                    }
                    break;
                case 'S':
                    if (value) {
                        direction = 'W';
                        x--;
                    } else {
                        direction = 'E';
                        x++;
                    }
                    break;
                case 'W':
                    if (value) {
                        direction = 'N';
                        y--;
                    } else {
                        direction = 'S';
                        y++;
                    }
                    break;
            }
            tick = false;
            setTimeout(function() {
                // console.log('input');
                if (map.has(`${x}|${y}`)) {
                    cpu.input(map.get(`${x}|${y}`));
                } else {
                    cpu.input(0);
                }
            }, 0);
        } else {
            // paint
            map.set(`${x}|${y}`, value);
            tick = true;
        }
    });
    map.set(`0|0`, 1);
    cpu.setMemory(input);
    cpu.execute().then(() => {
        console.log(map.size);
        var mapArray = Array.from(map);
        var code = [];
        for (var i = 0; i < mapArray.length; i++) {
            const [x, y] = mapArray[i][0].split('|').map(v => parseInt(v, 10));
            if (!code[y]) {
                code[y] = [];
            }
            code[y][x] = mapArray[i][1];
        }
        console.log(code.map(line => {
            if (!line[0]) {
                line[0] = 0;
            }
            return line.map(cell => cell ? '#' : ' ').join('');
        }).join('\n'));
    });
    cpu.input(1);
});
