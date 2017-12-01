var input = 33100000;
var houseNumber = 0;
var presentsNumber = 0;
var elvesVisits = {};
var housesPresents = {};

while(presentsNumber < input){
    houseNumber++;
    presentsNumber=0;
    elvesVisits[houseNumber]={};
    housesPresents[houseNumber]=0;
    for(var elfNumber=1;elfNumber<=houseNumber; elfNumber++){
        if(elvesVisits[houseNumber][elfNumber] < 50 && houseNumber%elfNumber == 0){
            if(typeof elvesVisits[houseNumber][elfNumber] == 'undefined'){
                elvesVisits[houseNumber][elfNumber]=0;
            }
            elvesVisits[houseNumber][elfNumber]++;
            presentsNumber = housesPresents[houseNumber]+= elfNumber*12;
        }
    }
}

console.log(houseNumber);