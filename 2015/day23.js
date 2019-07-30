var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(`${__dirname}/day23.input`)
});

const registers = {
    a: 0,
    b: 0
};
var instructions = [];

lineReader.on('line', function(line) {
    const [, instruction, register, , offset] = /^(.{3,3})\s(a|b)?(,?\s?(\S+))?$/.exec(line);
    instructions.push({
        instruction,
        register,
        offset: parseInt(offset, 10)
    });
});

lineReader.on('close', function() {
    var currentIndex = 0;
    var currentInstruction;

    while (currentIndex < instructions.length) {
        currentInstruction = instructions[currentIndex];
        console.log(currentIndex, currentInstruction);
        switch (currentInstruction.instruction) {
            case 'hlf':
                registers[currentInstruction.register] = registers[currentInstruction.register] / 2;
                currentIndex++;
                break;
            case 'tpl':
                registers[currentInstruction.register] = registers[currentInstruction.register] * 3;
                currentIndex++;
                break;
            case 'inc':
                registers[currentInstruction.register]++;
                currentIndex++;
                break;
            case 'jmp':
                registers[currentInstruction.register]++;
                currentIndex += currentInstruction.offset;
                break;
            case 'jie':
                if (registers[currentInstruction.register] % 2 === 0) {
                    currentIndex += currentInstruction.offset;
                } else {
                    currentIndex++;
                }
                break;
            case 'jio':
                if (registers[currentInstruction.register] === 1) {
                    currentIndex += currentInstruction.offset;
                } else {
                    currentIndex++;
                }
                break;
        }
    }
    console.log(registers.b);
});
