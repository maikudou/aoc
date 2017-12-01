var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day16.input')
});

var regexp = /\w+ (\d+): (\w+): (\d+), (\w+): (\d+), (\w+): (\d+)/;
var tape = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1,
}

lineReader.on('line', function (line) {
    var found=regexp.exec(line);
    if(tape[found[2]]==Number(found[3]) && tape[found[4]]==Number(found[5]) && tape[found[6]]==Number(found[7])){
        console.log(found[1]);
    }
});

lineReader.on('close', function () {

});