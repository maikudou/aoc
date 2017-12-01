var fs = require('fs');

file = fs.readFileSync('./day12.input');

data = JSON.parse(file.toString());

sum = 0;

function parseAndSum(item){
    if(typeof item == 'object'){
        var keys = Object.keys(item);
        var redFound = false;

        if(typeof item.length == 'undefined'){
            for(var i=0; i<keys.length; i++){
                if(typeof item[keys[i]] == 'string'){
                    if(item[keys[i]]=='red'){
                        redFound = true;
                        break;
                    }
                }
            }
        }

        if(!redFound){
            for(var i=0; i<keys.length; i++){
                if(typeof item[keys[i]] == 'number'){
                    sum += item[keys[i]];
                }else{
                    parseAndSum(item[keys[i]]);
                }
            }
        }
    }
}

parseAndSum(data);

console.log(sum);