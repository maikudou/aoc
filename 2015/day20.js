var input = 3310000//0;
var houseNumber = 0;
var presentsNumber = 0;
var simpleNumbers = [];
var simpleNumbersLiteral = [];

var time = new Date();
while(presentsNumber < input){
    houseNumber++;
    presentsNumber=0;

    simple = true;

    for(var j=0; j<simpleNumbersLiteral.length; j++){
        if(houseNumber%(simpleNumbersLiteral[j])==0){
            simple = false;
            break;
        }
    }

    if(houseNumber > 1 && simple){
        simpleNumbers.push(true);
        simpleNumbersLiteral.push(houseNumber);
    }else{
        simpleNumbers.push(false);
    }

    if(simple){
        presentsNumber = 10+houseNumber*10;
    }else{
        for(var elfNumber=1;elfNumber<=houseNumber; elfNumber++){
            if(houseNumber%elfNumber == 0){
                presentsNumber += elfNumber*10;
            }
        }
    }
}

console.log(houseNumber, new Date() - time);