/**
 * Creates a new Befunge93 interpreter
 * @class
 */
class Befunge93 {

    /**
     * @constructor
     * @param {Befunge93~onStackChange} [onStackChange] - Called when the stack is updated (pushed or popped). Supplies 1 arg, current stack
     * @param {Befunge93~onOutput} [onOutput] - Called when output happens (, or . commands). Supplies 1 arg, the generated output
     * @param {Befunge93~onCellChange} [onCellChange] - Called when program is changed (p command) Supplies 3 args, current x, current y,
     *                                    and the new value of the cell
     * @param {Befunge93~onStep} [onStep] - Called when the interpreter makes a step (changing program cursor). Supplies 2 args the current X and Y values
     * @param {Befunge93~onInput} [onInput] - Called when the interpreter needs user input. Supplies 1 arg, prompt message
     */
    constructor(onStackChange = null, onOutput = null, onCellChange = null, onStep = null, onInput = null) {
        this.onStackChange = onStackChange;
        this.onOutput = onOutput;
        this.onCellChange = onCellChange;
        this.onStep = onStep;
        this.onInput = onInput;
        this.hasNext = false;
        this.ignoreCallbacks = false;
        this.output = "";
        this.x = 0;
        this.y = 0;
        this.dX = 1;
        this.dY = 0;
        this.stack = [];
        this.stringMode = false;
        this.programLoaded = false;
        this.program = function () {
            let program = [];
            for (let i = 0; i < 25; i++) {
                program.push(new Array(80).fill(" "));
            }
            return program;
        }();
    }

    /**
     * Called when the stack is changed
     * @callback Befunge93~onStackChange
     * @param {array} stack - The current stack
     * */

    /**
     * Called when the interpreter parses "." or ","
     * @callback Befunge93~onOutput
     * @param {string} value - The value that was output from interpreter
     */

    /**
     * @callback Befunge93~onCellChange
     * @param {number} x - The changed cell's x position
     * @param {number} y - The changed cell's y position
     * @param {string} newValue - The changed cell's new value
     */

    /**
     * Called when the interpreter's cursor position is changed
     * @callback Befunge93~onStep
     * @param {number} x - Cursor's current X position
     * @param {number} y - Cursor's current y position
     */

    /**
     * Called when the interpreter parses "~" or "&".
     * @callback Befunge93~onInput
     * @param {string} message - The message that will be displayed to the user; can be replaced by whatever you want
     * @returns {string} Input from the user.
     */

    /**
     * Called every tick of the interpreter. Only useful for benchmarking
     * @callback Befunge93~onTick
     */

    /** @private */
    _onStackChange() {
        if (this.ignoreCallbacks) return;
        if (this.onStackChange) {
            this.onStackChange(this.stack);
        }
    }

    /** @private */
    _onOutput(value) {
        this.output += value;
        if (this.ignoreCallbacks) return;
        if (this.onOutput) {
            this.onOutput(value);
        }
    }

    /** @private */
    _onInput(message) {
        return this.onInput ?
            this.onInput(message) : '';
    }

    /** @private */
    _onCellChange(x, y, newValue) {
        if (this.ignoreCallbacks) return;
        if (this.onCellChange) {
            this.onCellChange(x, y, newValue);
        }
    }

    /** @private */
    _onStep() {
        if (this.ignoreCallbacks) return;
        if (this.onStep) {
            this.onStep(this.x, this.y);
        }
    }

    /** @private */
    pop() {
        let v = this.stack.pop();
        this._onStackChange();
        if (v === undefined) {
            return 0;
        } else {
            return v;
        }
    }

    /** @private */
    push(value) {
        this.stack.push(value);
        this._onStackChange()
    }

    /** @private */
    step(doCallback = true) {
        this.x += this.dX;
        this.y += this.dY;
        if (this.x >= 80) this.x = 0;
        if (this.x < 0) this.x = 79;
        if (this.y >= 25) this.y = 0;
        if (this.y < 0) this.y = 24;
        if (doCallback) {
            this._onStep();
        }
    }

    /** @private */
    parseToken(token) {
        if (this.stringMode) {
            let char = token.charCodeAt(0);
            if (char === 34) { // Char code for "
                this.toggleStringMode();
            } else if (char <= 255) {
                this.push(char);
            }
        } else {
            if (Befunge93.isHexDigit(token)) {
                this.pushHexValueToStack(token);
            } else {
                switch (token) {
                    case " ":
                        break;
                    case ">":
                        this.right();
                        break;
                    case "<":
                        this.left();
                        break;
                    case "^":
                        this.up();
                        break;
                    case "v":
                        this.down();
                        break;
                    case "?":
                        this.randomDirection();
                        break;
                    case "+":
                        this.add();
                        break;
                    case "-":
                        this.subtract();
                        break;
                    case "*":
                        this.multiply();
                        break;
                    case "/":
                        this.divide();
                        break;
                    case "%":
                        this.modulo();
                        break;
                    case "`":
                        this.greaterThan();
                        break;
                    case "!":
                        this.not();
                        break;
                    case "_":
                        this.horizontalIf();
                        break;
                    case "|":
                        this.verticalIf();
                        break;
                    case ":":
                        this.duplicate();
                        break;
                    case "\\":
                        this.swap();
                        break;
                    case "$":
                        this.discard();
                        break;
                    case ".":
                        this.outInt();
                        break;
                    case ",":
                        this.outAscii();
                        break;
                    case "#":
                        this.bridge();
                        break;
                    case "g":
                        this.get();
                        break;
                    case "p":
                        this.put();
                        break;
                    case "&":
                        this.inInt();
                        break;
                    case "~":
                        this.inAscii();
                        break;
                    case `"`:
                        this.toggleStringMode();
                        break;
                    case "@":
                        this.terminateProgram();
                        break;
                }
            }
        }
    }

    /** @private */
    pushHexValueToStack(token) {
        this.push((parseInt(token, 16)));
    }

    /** @private */
    add() {
        let b = this.pop();
        let a = this.pop();
        this.push(a + b);
    }

    /** @private */
    subtract() {
        let b = this.pop();
        let a = this.pop();
        this.push(a - b);
    }

    /** @private */
    multiply() {
        let b = this.pop();
        let a = this.pop();
        this.push(a * b);
    }

    /** @private */
    divide() {
        let b = this.pop();
        let a = this.pop();
        if (b !== 0) {
            this.push(Math.trunc(a / b));
        } else {
            this.push(0)
        }
    }

    /** @private */
    modulo() {
        let b = this.pop();
        let a = this.pop();
        this.push(a % b);
    }

    /** @private */
    not() {
        if (this.pop()) {
            this.push(0);
        } else {
            this.push(1);
        }
    }

    /** @private */
    greaterThan() {
        let b = this.pop();
        let a = this.pop();
        if (a > b) {
            this.push(1);
        } else {
            this.push(0);
        }
    }

    /** @private */
    right() {
        this.dY = 0;
        this.dX = 1;
    }

    /** @private */
    left() {
        this.dY = 0;
        this.dX = -1;
    }

    /** @private */
    up() {
        this.dY = -1;
        this.dX = 0;
    }

    /** @private */
    down() {
        this.dY = 1;
        this.dX = 0;
    }

    /** @private */
    randomDirection() {
        let r = Math.random();
        if (r <= 0.25) {
            this.left();
        } else if (r <= 0.50) {
            this.right();
        } else if (r <= 0.75) {
            this.up();
        } else if (r <= 1.00) {
            this.down();
        }
    }

    /** @private */
    horizontalIf() {
        if (this.pop()) {
            this.left();
        } else {
            this.right();
        }
    }

    /** @private */
    verticalIf() {
        if (this.pop()) {
            this.up();
        } else {
            this.down();
        }
    }

    /** @private */
    toggleStringMode() {
        this.stringMode = !this.stringMode;
    }

    /** @private */
    duplicate() {
        let a = this.pop();
        this.push(a);
        this.push(a);
    }

    /** @private */
    swap() {
        let b = this.pop();
        let a = this.pop();
        this.push(b);
        this.push(a);
    }

    /** @private */
    discard() {
        this.pop();
    }

    /** @private */
    put() {
        let y = this.pop();
        let x = this.pop();
        let v = String.fromCharCode(this.pop() % 256);
        this.program[y][x] = v;
        this._onCellChange(x, y, v);
    }

    /** @private */
    get() {
        this.push(this.program[this.pop()][this.pop()].charCodeAt(0));
    }

    /** @private */
    bridge() {
        this.step()
    }

    /** @private */
    outInt() {
        this._onOutput(this.pop().toString());
    }

    /** @private */
    outAscii() {
        this._onOutput(String.fromCharCode(this.pop()));
    }

    /** @private */
    inInt() {
        this.push(parseInt(this._onInput("Enter integer: ")));
    }

    /**
     * Converts user entry to char code and pushes to stack. If more than one character entered, only the first is used
     * @private */
    inAscii() {
        this.push(parseInt(this._onInput("Enter ASCII character: ").charCodeAt(0)));
    }

    /** @private */
    terminateProgram() {
        this.hasNext = false;
    }

    loadProgram(data) {
        let lines = data.split(/(?:\r\n)|(?:\r)|(?:\n)/);
        for (let y = 0; y < lines.length; y++) {
            for (let x = 0; x < lines[y].length; x++) {
                this.program[y][x] = lines[y][x];
            }
        }
        this.programLoaded = true;
        this.hasNext = true;
        return true;
    }

    /** @private */
    getToken(x, y) {
        if (!(0 <= x < 80) || !(0 <= y < 25)) {
            throw new Error("Coordinates out of range!")
        }
        return this.program[y][x]
    }

    /** @private */
    init(program) {
        if (this.loadProgram(program)) {
            this.hasNext = true;
            this.programLoaded = true;
        } else {
            throw new Error("Program failed to load");
        }
    }

    /** @private
     *  @static */
    static isHexDigit(value) {
        let a = parseInt(value, 16);
        return (a.toString(16) === value.toLowerCase())
    }

    /** @public */
    stepInto() {
        let token = this.getToken(this.x, this.y);
        if (this.stringMode) {
            this.parseToken(token);
            this.step();
        } else {
            if (token !== " ") {
                this.parseToken(token);
                this.step();
            } else {
                this.step();
            }
            if(this.getToken(this.x, this.y) === " "){
                this.stepInto();
            }
        }
    }

    /**
     * Stops executing of the program
     * @public */
    pause() {
        this.hasNext = false;
    }

    /**
     *  Allows execution of the program to continue. Does NOT actually proceed with execution
     * @public */
    resume() {
        this.hasNext = true;
    }

    /**
     *
     * @param {string} program - The program to be run. Lines separated with \n, \r, or \n\r
     * @param {boolean} [reset] - Reset interpreter to default before running?
     * @param {function} [onTick] - Called every tick. Useful for benchmarking programs
     * */
    run(program, reset = false, onTick = null) {
        return new Promise((resolve, reject) => {
            if (reset) {
                this.reset();
            }
            this.init(program);
            while (this.hasNext) {
                if (onTick) {
                    onTick();
                }
                this.stepInto();
            }
            resolve(this.output);
        });
    }

    /**
     * Resets the interpreter to default state
     * @public */
    reset() {
        this.program = function () {
            let program = [];
            for (let i = 0; i < 25; i++) {
                program.push(new Array(80).fill(" "));
            }
            return program;
        }();
        this.stack = [];
        this.output = '';
        this.x = 0;
        this.y = 0;
        this.right();
        this.stringMode = false;
    }
}

try {
    module.exports = Befunge93;
} catch (Error) {

}
