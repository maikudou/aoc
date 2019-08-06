var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(`${__dirname}/day12.input`)
});

const registers = {
    a: 0,
    b: 0,
    c: 0,
    d: 0
};
var instructions = [];

lineReader.on('line', function(line) {
    const [, instruction, operand1, operand2] = /^(cpy|inc|dec|jnz) (\d+|[abcd])(?: (-?\d+|[abcd]))?$/.exec(line);
    instructions.push({
        instruction,
        operand1,
        operand2
    });
});

lineReader.on('close', function() {
    var currentIndex = 0;
    var currentInstruction;

    while (currentIndex < instructions.length) {
        currentInstruction = instructions[currentIndex];
        // console.log(currentIndex, currentInstruction);
        switch (currentInstruction.instruction) {
            case 'cpy':
                registers[currentInstruction.operand2] = isNaN(currentInstruction.operand1)
                    ? registers[currentInstruction.operand1] : parseInt(currentInstruction.operand1, 10);
                currentIndex++;
                break;
            case 'inc':
                registers[currentInstruction.operand1] = registers[currentInstruction.operand1] + 1;
                currentIndex++;
                break;
            case 'dec':
                registers[currentInstruction.operand1] = registers[currentInstruction.operand1] - 1;
                currentIndex++;
                break;
            case 'jnz':
                currentIndex += currentInstruction.operand1 ? parseInt(currentInstruction.operand2, 10) : 1;
                break;
        }
    }
    console.log(registers.a);
});
