var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day15.input')
});

var regexp = /(\w+): (\w+) (-?\d+), (\w+) (-?\d+), (\w+) (-?\d+), (\w+) (-?\d+), (\w+) (-?\d+)/;
var ingridients = {};
var maxValue = 0;

lineReader.on('line', function (line) {
    var found=regexp.exec(line);
    ingridients[found[1]] = {};
    ingridients[found[1]][found[2]] = Number(found[3])
    ingridients[found[1]][found[4]] = Number(found[5])
    ingridients[found[1]][found[6]] = Number(found[7])
    ingridients[found[1]][found[8]] = Number(found[9])
    ingridients[found[1]][found[10]] = Number(found[11])
});

lineReader.on('close', function () {
    console.log(ingridients);
    var keys = Object.keys(ingridients);
    for(var i=1; i<98; i++){
        for(var j=1; j<98; j++){
            for(var k=1; k<98; k++){
                for(var l=1; l<98; l++){
                    if(l+k+j+i == 100){
                        var capacity    = ingridients[keys[0]].capacity*i + ingridients[keys[1]].capacity*j + ingridients[keys[2]].capacity*k + ingridients[keys[3]].capacity*l;
                        var durability  = ingridients[keys[0]].durability*i + ingridients[keys[1]].durability*j + ingridients[keys[2]].durability*k + ingridients[keys[3]].durability*l;
                        var flavor      = ingridients[keys[0]].flavor*i + ingridients[keys[1]].flavor*j + ingridients[keys[2]].flavor*k + ingridients[keys[3]].flavor*l;
                        var texture     = ingridients[keys[0]].texture*i + ingridients[keys[1]].texture*j + ingridients[keys[2]].texture*k + ingridients[keys[3]].texture*l;
                        var calories    = ingridients[keys[0]].calories*i + ingridients[keys[1]].calories*j + ingridients[keys[2]].calories*k + ingridients[keys[3]].calories*l;
                        if(capacity < 0){
                            capacity = 0;
                        }
                        if(durability < 0){
                            durability = 0;
                        }
                        if(flavor < 0){
                            flavor = 0;
                        }
                        if(texture < 0){
                            texture = 0;
                        }
                        var value = capacity*durability*flavor*texture;
                        if(calories == 500 && value > maxValue){
                            maxValue = value;
                        }
                    }
                }
            }
        }
    }

    console.log(maxValue);
});