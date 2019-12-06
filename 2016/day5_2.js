const input = 'ffykfhsq';
var crypto = require('crypto');

var password = [];
var goodCount = 0;
var i = 0;
while (goodCount < 8) {
    var hash = String(crypto.createHash('md5').update(input + i++).digest('hex'));
    if (hash.indexOf('00000') === 0) {
        console.log(hash);
        if (hash[5] < 8 && !password[hash[5]]) {
            password[hash[5]] = hash[6];
            console.log(password);
            goodCount++;
        }
    }
}

console.log(password.join(''));
