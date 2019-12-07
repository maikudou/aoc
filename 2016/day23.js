var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(`${__dirname}/day23.input`)
});

// const registers = {
//     a: 0,
//     b: 0,
//     c: 0,
//     d: 0
// };
var instructions = [];

lineReader.on('line', function(line) {
    const [, instruction, operand1, operand2] = /^(cpy|inc|dec|jnz|tgl) (-?\d+|[abcd])(?: (-?\d+|[abcd]))?$/.exec(line);
    instructions.push({
        instruction,
        operand1: isNaN(operand1) ? operand1 : parseInt(operand1, 10),
        operand2: isNaN(operand2) ? operand2 : parseInt(operand2, 10)
    });
});

function processInstructions(instructions, registers) {
    var currentIndex = 0;
    var currentInstruction;
    var toggleIndex;
    var prevInstruction;

    while (currentIndex < instructions.length) {
        currentInstruction = instructions[currentIndex];
        switch (currentInstruction.instruction) {
            case 'tgl':
                toggleIndex = currentIndex + (isNaN(currentInstruction.operand1)
                    ? registers[currentInstruction.operand1] : currentInstruction.operand1);
                prevInstruction = instructions[toggleIndex];

                switch (prevInstruction.instruction) {
                    case 'inc':
                        prevInstruction.instruction = 'dec';
                        break;
                    case 'dec':
                        prevInstruction.instruction = 'inc';
                        break;
                    case 'tgl':
                        prevInstruction.instruction = 'inc';
                        break;
                    case 'jnz':
                        prevInstruction.instruction = 'cpy';
                        break;
                    case 'cpy':
                        prevInstruction.instruction = 'jnz';
                        break;
                }

                currentIndex++;
                break;
            case 'cpy':
                if (!isNaN(currentInstruction.operand2)) {
                    continue;
                }
                registers[currentInstruction.operand2] = isNaN(currentInstruction.operand1)
                    ? registers[currentInstruction.operand1] : currentInstruction.operand1;
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
                if (!isNaN(currentInstruction.operand2)) {
                    continue;
                }
                var checkingValue = isNaN(currentInstruction.operand1)
                    ? registers[currentInstruction.operand1] : currentInstruction.operand1;
                currentIndex += checkingValue ? currentInstruction.operand2 : 1;
                break;
        }
    }

    return registers.a;
}

lineReader.on('close', function() {
    console.log(`Part 1: ${processInstructions(instructions, { a: 7, b: 0, c: 0, d: 0 })}`);
    // console.log(`Part 2: ${processInstructions(instructions, { a: 0, b: 0, c: 1, d: 0 })}`);
});
