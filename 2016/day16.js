function getData(data, targetLength) {
    // console.time('getData');
    while (data.length < targetLength) {
        // console.log(targetLength, data.length);
        var length = data.length;
        data.push('0');
        for (var i = length - 1; i >= 0; i--) {
            data.push(data[i] === '0' ? '1' : '0');
        }
    }
    // console.timeEnd('getData');
    return data.slice(0, targetLength);
}

function getChecksum(data) {
    // console.time('getChecksum');
    var checksum = [];
    while (!(checksum.length % 2) || checksum.length === 0) {
        checksum = [];
        for (var i = 0; i < data.length - 1; i += 2) {
            if (data[i] === data[i + 1]) {
                checksum.push('1');
            } else {
                checksum.push('0');
            }
        }
        data = checksum;
    }
    // console.timeEnd('getChecksum');
    return checksum;
}

console.log('Test', getChecksum(getData('10000'.split(''), 20)).join(''));

var result = getChecksum(getData('11011110011011101'.split(''), 272));
console.log('Part 1', result.join(''));

result = getChecksum(getData('11011110011011101'.split(''), 35651584));

console.log('Part 2', result.join(''));
