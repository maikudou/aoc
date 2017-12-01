var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day7.input')
});

var circuit = {}

lineReader.on('line', function (line) {
    var instr = line.split(' -> ');
    var wireName = instr[1];
    var found = null
    var foundNot = null
    var foundOther = null

    if(found = /OR|AND|RSHIFT|LSHIFT|NOT/gi.exec(instr[0])){
        if(foundNot = /NOT (\S+)/gi.exec(instr[0])){
            circuit[wireName] = function(){
                return ~ getWire(foundNot[1], 'NOT')
            }
        }
        if(foundOther = /(\S+) (OR|AND|RSHIFT|LSHIFT) (\S+)/gi.exec(instr[0])){
            circuit[wireName] = function(){
                return getResult(foundOther[1], foundOther[3], foundOther[2])
            }
        }
    }else{
        if(isNaN(parseInt(instr[0]))){
            circuit[wireName] = function(){
                return getWire(instr[0], 'Direct');
            }
        }else{
            circuit[wireName] = parseInt(instr[0])
        }
    }
});

getResult = function(left, right, operand){
    if(isNaN(parseInt(left))){
        left = getWire(left, operand)
    }else{
        left = parseInt(left)
    }
    if(isNaN(parseInt(right))){
        right = getWire(right, operand)
    }else{
        right = parseInt(right)
    }

    switch(operand){
        case 'OR':
            return left | right
            break;
        case 'AND':
            return left & right
            break;
        case 'LSHIFT':
            return left << right
            break;
        case 'RSHIFT':
            return left >> right
            break;
    }
}

getWire = function(wireName, source){
    if(typeof circuit[wireName] == 'function'){
        return circuit[wireName] = circuit[wireName]();
    }else{
        return circuit[wireName];
    }
}

var pathToInput=[];

lineReader.on('close', function () {
    circuit['b']=3176;
    console.log(getWire('a'));
});
