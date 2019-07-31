const input = 'ffykfhsq';
var crypto = require('crypto');

var password = '';
var i = 0;
while (password.length < 8) {
    var hash = String(crypto.createHash('md5').update(input + i++).digest('hex'));
    if (hash.indexOf('00000') === 0) {
        console.log(hash);
        password = password + String(hash[5]);
    }
}

console.log(password);
