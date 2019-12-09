class IntCode {
    constructor(input = () => null, output = (str) => console.log(str)) {
        this._input = input;
        this._output = output;
        this._memory = [];
        this._pointer = 0;
    }
    setMemory(program) {
        this._memory = program.slice(0);
    }
    execute() {
        this._pointer = 0;
        var nextInstruction = this._memory[this._pointer];
        while (nextInstruction) {
            // console.log(this._pointer, this._memory);
            var offset = this.processInstruction(nextInstruction);
            if (offset === 0) {
                break;
            }
            this._pointer += offset;
            nextInstruction = this._memory[this._pointer];
        }
    }

    // returns pointer offset after execution
    processInstruction(instruction) {
        // console.log('processInstruction', instruction);
        var opCode = instruction % 100;
        instruction -= opCode;
        instruction = instruction / 100;
        var mode1 = instruction % 10;
        instruction -= mode1;
        instruction = instruction / 10;
        var mode2 = instruction % 10;
        // instruction -= mode2;
        // instruction = instruction / 10;
        // var mode3 = instruction % 10;
        return this.processOpCode(opCode, mode1, mode2);
    }

    processOpCode(opCode, mode1, mode2) {
        // console.log('processOpCode', opCode, mode1, mode2);
        var offset = 0;
        switch (opCode) {
            case 1:
                this.setValueAt(
                    this.getValueAt(this._pointer + 3),
                    this.getValueWithMode(mode1, this._pointer + 1)
                    + this.getValueWithMode(mode2, this._pointer + 2)
                );
                offset = 4;
                break;
            case 2:
                this.setValueAt(
                    this.getValueAt(this._pointer + 3),
                    this.getValueWithMode(mode1, this._pointer + 1)
                    * this.getValueWithMode(mode2, this._pointer + 2)
                );
                offset = 4;
                break;
            case 3:
                this.setValueAt(this.getValueAt(this._pointer + 1), this._input());
                offset = 2;
                break;
            case 4:
                this._output(this.getValueWithMode(mode1, this._pointer + 1));
                offset = 2;
                break;
            case 5:
                if (this.getValueWithMode(mode1, this._pointer + 1)) {
                    offset = this.getValueWithMode(mode2, this._pointer + 2) - this._pointer;
                } else {
                    offset = 3;
                }
                break;
            case 6:
                if (!this.getValueWithMode(mode1, this._pointer + 1)) {
                    offset = this.getValueWithMode(mode2, this._pointer + 2) - this._pointer;
                } else {
                    offset = 3;
                }
                break;
            case 7:
                this.setValueAt(
                    this.getValueAt(this._pointer + 3),
                    this.getValueWithMode(mode1, this._pointer + 1)
                    < this.getValueWithMode(mode2, this._pointer + 2)
                        ? 1 : 0
                );
                offset = 4;
                break;
            case 8:
                this.setValueAt(
                    this.getValueAt(this._pointer + 3),
                    this.getValueWithMode(mode1, this._pointer + 1)
                    === this.getValueWithMode(mode2, this._pointer + 2)
                        ? 1 : 0
                );
                offset = 4;
                break;
            case 99:
                break;
        }
        // console.log(offset);
        return offset;
    }

    getValueWithMode(mode, pointer) {
        return mode ? this.getValueAt(pointer) : this.getPointedValueAt(pointer);
    }

    getValueAt(pointer) {
        return this._memory[pointer];
    }

    getPointedValueAt(pointer) {
        return this._memory[this.getValueAt(pointer)];
    }

    setValueAt(pointer, value) {
        this._memory[pointer] = value;
    }
}

module.exports = IntCode;
