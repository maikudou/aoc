var key = 'yzbqklnj';
var crypto = require('crypto');

for (var i = 0; i < 10000000; i++) {
    var hash = crypto.createHash('md5').update(key + i).digest('hex');

    if (String(hash).indexOf('000000') === 0) {
        console.log(hash, i);
        break;
    }
}
