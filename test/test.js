const Befunge = require('../lib/befunge93');
const chai = require('chai'), expect = chai.expect;
const sinon = require("sinon"), sinonChai = require("sinon-chai");
const assert = require("assert");
chai.use(sinonChai);

describe('Befunge', function () {
    let bef;
    beforeEach(function () {
        bef = new Befunge();
    });

    describe('#pop', function () {
        it('should return last value of array', function () {
            bef.stack = [1, 2, 3, 4, 5];
            expect(bef.pop()).to.equal(5);
        });

        it('should return 0 in case of underflow', function () {
            bef.stack = [1];
            bef.pop();
            expect(bef.pop()).to.equal(0);
        });
    });

    describe('#step()', function () {
        it('should increment x when moving right', function () {
            bef.right();
            for (let i = 0; i < 5; i++) {
                bef.step();
                expect(bef.x).to.equal(i + 1);
            }
        });

        it('should wrap x when moving right and hits edge', function () {
            bef.right();
            bef.x = 79;
            bef.step();
            expect(bef.x).to.equal(0);
        });

        it('should decrement x when moving left', function () {
            bef.left();
            bef.x = 5;
            for (let i = 5; i > 0; i--) {
                bef.step();
                expect(bef.x).to.equal(i - 1);
            }
        });

        it('should wrap x when moving left and hits edge', function () {
            bef.left();
            bef.x = 0;
            bef.step();
            expect(bef.x).to.equal(79);
        });

        it('should increment y when moving down', function () {
            bef.down();
            for (let i = 0; i < 5; i++) {
                bef.step();
                expect(bef.y).to.equal(i + 1);
            }
        });

        it('should wrap y when moving down and hits edge', function () {
            bef.down();
            bef.y = 24;
            bef.step();
            expect(bef.y).to.equal(0);
        });

        it('should decrement y when moving up', function () {
            bef.up();
            bef.y = 5;
            for (let i = 5; i > 0; i--) {
                bef.step();
                expect(bef.y).to.equal(i - 1);
            }
        });

        it('should wrap y when moving up and hits edge', function () {
            bef.up();
            bef.y = 0;
            bef.step();
            expect(bef.y).to.equal(24);
        });
    });

    describe('#noOp', function () {
        it('should not do anything, really', function () {

        });
    });

    describe('#pushHexValueToStack()', function () {
        it('should push 1 to stack when parse 1', function () {
            bef.parseToken("1");
            expect(bef.stack).to.deep.equal([1]);
        });

        it('should push 1 then 2 to stack when parse 1 then parse 2', function () {
            bef.parseToken("1");
            bef.parseToken("2");
            expect(bef.stack).to.deep.equal([1, 2]);
        });

        it('should push dec 10 value to stack when parse a', function () {
            bef.parseToken("a");
            expect(bef.stack).to.deep.equal([10]);
        });

        it('should push dec 15 value to stack when parse f', function () {
            bef.parseToken("f");
            expect(bef.stack).to.deep.equal([15]);
        });

        it('should not push incorrect (/^[0-9A-F]/i) to stack', function () {
            bef.parseToken("h");
            expect(bef.stack).to.deep.equal([]);
        });

        it('should push arbitrary (correct) (/[0-9A-F]/i) values to stack', function () {
            let vals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', "a", "b", "c", "d", "e", "f", "A", "B", "C", "D", "E", "F"];
            let correctStack = [];
            for (let i = 0; i < 10000; i++) {
                let token = vals[Math.floor(Math.random() * 22)];
                correctStack.push(parseInt(token, 16));
                bef.parseToken(token);
            }
            expect(bef.stack).to.deep.equal(correctStack);
        });
    });

    describe('#add()', function () {
        it('given [a,b] should do give [a+b] ', function () {
            bef.stack = [1, 2];
            bef.add();
            expect(bef.stack).to.deep.equal([3]);
        });

        it('given [a] should do give [a+0]', function () {
            bef.stack = [2];
            bef.add();
            expect(bef.stack).to.deep.equal([2]);
        });
    });

    describe('#subtract()', function () {
        it('given [a,b] should do give [a-b]', function () {
            bef.stack = [2, 1];
            bef.subtract();
            expect(bef.stack).to.deep.equal([1]);
        });
    });

    describe('#multiply()', function () {
        it('given [a,b] should do give [a*b]', function () {
            bef.stack = [2, 3];
            bef.multiply();
            expect(bef.stack).to.deep.equal([6]);
        });

        it('given [a] should do give [0]', function () {
            bef.stack = [2];
            bef.multiply();
            expect(bef.stack).to.deep.equal([0]);
        });
    });

    describe('#divide()', function () {
        it('given [a,b] should do give [b/a]', function () {
            bef.stack = [6, 3];
            bef.divide();
            expect(bef.stack).to.deep.equal([2]);
        });

        it('given [b] should do give [0/b]', function () {
            bef.stack = [6];
            bef.divide();
            expect(bef.stack).to.deep.equal([0]);
        });

        it('given [0, a] should do give 0', function () {
            bef.stack = [0, 5];
            bef.divide();
            expect(bef.stack).to.deep.equal([0]);
        });
    });

    describe('#modulo()', function () {
        it('given [a,b] should do give [a%b]', function () {
            bef.stack = [2, 3];
            bef.modulo();
            expect(bef.stack).to.deep.equal([2]);
        });

        it('given [b] should do give [0%b]', function () {
            bef.stack = [3];
            bef.modulo();
            expect(bef.stack).to.deep.equal([0]);
        });
    });

    describe('#not()', function () {
        it('should give 0 if value is non-zero', function () {
            bef.stack = [1];
            bef.not();
            expect(bef.stack).to.deep.equal([0]);
        });

        it('should give 1 if value is zero', function () {
            bef.stack = [0];
            bef.not();
            expect(bef.stack).to.deep.equal([1]);
        });
    });

    describe('#greaterThan()', function () {
        it('should push 1 if a > b', function () {
            bef.stack = [5, 2];
            bef.greaterThan();
            expect(bef.stack).to.deep.equal([1]);
        });

        it('should push 0 if a < b', function () {
            bef.stack = [2, 5];
            bef.greaterThan();
            expect(bef.stack).to.deep.equal([0]);
        });
    });

    describe('#right()', function () {
        it('should make direction right', function () {
            bef.right();
            expect(bef.dX).to.equal(1);
        });
    });

    describe('#left()', function () {
        it('should make direction left', function () {
            bef.left();
            expect(bef.dX).to.equal(-1);
        });
    });

    describe('#up()', function () {
        it('should make direction up', function () {
            bef.up();
            expect(bef.dY).to.equal(-1);
        });
    });

    describe('#down()', function () {
        it('should make direction down', function () {
            bef.down();
            expect(bef.dY).to.equal(1);
        });
    });

    describe('#randomDirection()', function () {
        it('should pick each direction about 25% of the time', function () {
            let counts = {up: 0, down: 0, right: 0, left: 0};
            let m = 10000;
            for (let i = 0; i < m; i++) {
                bef.randomDirection();
                if (bef.dX === 1) {
                    counts.right += 1;
                }
                if (bef.dX === -1) {
                    counts.left += 1;
                }
                if (bef.dY === 1) {
                    counts.down += 1;
                }
                if (bef.dY === -1) {
                    counts.up += 1;
                }
            }
            let up, down, left, right;
            const upperBound = m / 3;
            const lowerBound = m / 5;
            up = counts.up >= lowerBound && counts.up <= upperBound;
            down = counts.down >= lowerBound && counts.down <= upperBound;
            left = counts.left >= lowerBound && counts.left <= upperBound;
            right = counts.right >= lowerBound && counts.right <= upperBound;
            expect(up).to.be.true;
            expect(down).to.be.true;
            expect(left).to.be.true;
            expect(right).to.be.true;
        });
    });

    describe('#horizontalIf()', function () {
        it('should set direction to left when 1', function () {
            bef.stack = [1];
            bef.down();
            bef.horizontalIf();
            expect(bef.dX).to.equal(-1);
        });

        it('should set direction to left when truthy', function () {
            bef.stack = [4];
            bef.down();
            bef.horizontalIf();
            expect(bef.dX).to.equal(-1);
        });

        it('should set direction to right when 0', function () {
            bef.stack = [0];
            bef.down();
            bef.horizontalIf();
            expect(bef.dX).to.equal(1);
        });
    });

    describe('#verticalIf()', function () {
        it('should set direction to up when 1', function () {
            bef.stack = [1];
            bef.left();
            bef.verticalIf();
            expect(bef.dY).to.equal(-1);
        });

        it('should set direction to up when truthy', function () {
            bef.stack = [4];
            bef.left();
            bef.verticalIf();
            expect(bef.dY).to.equal(-1);
        });

        it('should set direction to down when 0', function () {
            bef.stack = [0];
            bef.left();
            bef.verticalIf();
            expect(bef.dY).to.equal(1);
        });
    });

    describe('String mode', function () {
        it('should toggle string mode', function () {
            expect(bef.stringMode).to.be.false;
            bef.toggleStringMode();
            expect(bef.stringMode).to.be.true;
            bef.toggleStringMode();
            expect(bef.stringMode).to.be.false;

        });

        it('should push ascii values to stack when parsing token', function () {
            bef.stringMode = true;
            bef.parseToken("a");
            bef.parseToken("<");
            bef.parseToken("+");
            bef.parseToken("@");
            bef.parseToken("|");
            expect(bef.stack).to.deep.equal([97, 60, 43, 64, 124]);
        });

        it('should only push up to 255 (aka, only ascii, not all of unicode!)', function () {
            bef.parseToken("ꜭ");
            bef.parseToken("Ꝛ");
            bef.parseToken("ꝡ");
            bef.parseToken("ꞓ");
            bef.parseToken("ā");
            expect(bef.stack).to.deep.equal([]);
        });

        it(`should toggle on stringmode when parsing a "`, function () {
            bef.parseToken(`"`);
            expect(bef.stringMode).to.be.true;
        });

        it('should toggle off stringmode when parsing another "', function () {
            bef.toggleStringMode();
            bef.parseToken(`"`);
            expect(bef.stringMode).to.be.false;
        });
    });

    describe('#duplicate()', function () {
        it('should duplicate top value of stack', function () {
            bef.stack = [2];
            bef.duplicate();
            expect(bef.stack).to.deep.equal([2, 2]);
        });

        it('should duplicate top value of stack ex 2', function () {
            bef.stack = [2, 6, 7, 1, 0, 7];
            bef.duplicate();
            expect(bef.stack).to.deep.equal([2, 6, 7, 1, 0, 7, 7]);
        });
    });

    describe('#swap()', function () {
        it('should swap top two stack values ex 1', function () {
            bef.stack = [1, 2];
            bef.swap();
            expect(bef.stack).to.deep.equal([2, 1]);
        });

        it('should swap top two stack values ex 2', function () {
            bef.stack = [1, 2, 3, 4, 5, 6, 7, 8];
            bef.swap();
            expect(bef.stack).to.deep.equal([1, 2, 3, 4, 5, 6, 8, 7]);
        });

        it('should swap top two stack values ex 3', function () {
            bef.stack = [4, 5, 6, 8, 7];
            bef.swap();
            bef.swap();
            expect(bef.stack).to.deep.equal([4, 5, 6, 8, 7]);
        });
    });

    describe('#discard()', function () {
        it('should pop last stack value', function () {
            bef.stack = [1, 2, 3, 4, 5, 6, 7, 8];
            bef.discard();
            expect(bef.stack).to.deep.equal([1, 2, 3, 4, 5, 6, 7]);
        });

        it('should be able to pop last stack value many times', function () {
            bef.stack = [1, 2, 3, 4, 5, 6, 7, 8];
            bef.discard();
            bef.discard();
            bef.discard();
            bef.discard();
            expect(bef.stack).to.deep.equal([1, 2, 3, 4]);
        });
    });

    describe('#outInt()', function () {
        it('should call callback with last value of stack + a space', function () {
            bef.onOutput = (value) => {
                return value;
            };
            bef.stack = [1, 2, 3];
            let returnValue = bef.outInt();
            expect(returnValue).to.equal("3 ");
        });
    });

    describe('#outAscii()', function () {
        it('should call callback with last value of space converted to ascii character', function () {
            bef.onOutput = (value) => {
                return value;
            };
            bef.stack = [32, 97];
            let returnValue = bef.outAscii();
            expect(returnValue).to.equal("a");
            returnValue = bef.outAscii();
            expect(returnValue).to.equal(" ");
        });
    });

    describe('#bridge()', function () {
        it('should perform a step', function () {
            bef.step();
            bef.step();
            bef.bridge();
            expect(bef.x).to.equal(3);
            expect(bef.y).to.equal(0);
            bef.down();
            bef.step();
            bef.bridge();
            expect(bef.x).to.equal(3);
            expect(bef.y).to.equal(2);
        });
    });

    describe('#put()', function () {
        it('should write value to program cell', function () {
            bef.stack = [97, 3, 6];
            bef.put();
            expect(bef.program[6][3]).to.equal("a");
        });
    });

    describe('#get()', function () {
        it('should push ascii value from program cell', function () {
            bef.program[3][2] = "A";
            bef.stack = [2, 3];
            bef.get();
            expect(bef.stack).to.deep.equal([65]);
        });

        it('should push zero if coords are out of bounds', function () {
            bef.stack = [80, 25];
            bef.get();
            expect(bef.stack).to.deep.equal([0]);
        });
    });

    describe('#inInt()', function () {
        it('should call the callback supplying the message and return the return value of it', function () {
            bef.onInput = () => {
                return 100;
            };
            bef.inInt();
            expect(bef.stack).to.deep.equal([100]);
        });
    });

    describe('#_onInput()', function () {
        it('should throw error if there is no callback', function () {
            assert.throws(() => bef._onInput(), Error);
        });
    });

    describe('#inAscii()', function () {
        it('should call the callback and push the ascii value of first char to stack', function () {
            bef.onInput = () => {
                return "callback";
            };
            bef.inAscii();
            expect(bef.stack).to.deep.equal([99]);
        });
    });

    describe('#terminateProgram()', function () {
        it('should set hasNext to false', function () {
            bef.terminateProgram();
            expect(bef.hasNext).to.be.false;
        });
    });

    describe('#isHexDigit()', function () {
        it('should give true for any single hex digit', function () {
            let t = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F'];
            t.forEach(function (val) {
                expect(Befunge.isHexDigit(val)).to.equal(true);
            });
        });

        it('should give false for anything else', function () {
            let t = ['g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q,', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z', '!', ";"];
            let t2 = [];
            t.forEach((v) => {
                t2.push(v.toUpperCase());
            });
            t.forEach(function (val) {
                expect(Befunge.isHexDigit(val)).to.equal(false);
            });
        });
    });

    describe('#parseToken', function () {
        it('should parse space', function () {
            expect(bef.parseToken(" ")).to.be.null;
        });

        it('should parse >', function () {
            let spy = sinon.spy(bef, "right");
            bef.parseToken(">");
            sinon.assert.calledOnce(spy);
        });

        it('should parse <', function () {
            let spy = sinon.spy(bef, "left");
            bef.parseToken("<");
            sinon.assert.calledOnce(spy);
        });

        it('should parse ^', function () {
            let spy = sinon.spy(bef, "up");
            bef.parseToken("^");
            sinon.assert.calledOnce(spy);
        });

        it('should parse v', function () {
            let spy = sinon.spy(bef, "down");
            bef.parseToken("v");
            sinon.assert.calledOnce(spy);
        });

        it('should parse ?', function () {
            let spy = sinon.spy(bef, "randomDirection");
            bef.parseToken("?");
            sinon.assert.calledOnce(spy);
        });

        it('should parse +', function () {
            let spy = sinon.spy(bef, "add");
            bef.parseToken("+");
            sinon.assert.calledOnce(spy);
        });

        it('should parse -', function () {
            let spy = sinon.spy(bef, "subtract");
            bef.parseToken("-");
            sinon.assert.calledOnce(spy);
        });

        it('should parse *', function () {
            let spy = sinon.spy(bef, "multiply");
            bef.parseToken("*");
            sinon.assert.calledOnce(spy);
        });

        it('should parse /', function () {
            let spy = sinon.spy(bef, "divide");
            bef.parseToken("/");
            sinon.assert.calledOnce(spy);
        });

        it('should parse %', function () {
            let spy = sinon.spy(bef, "modulo");
            bef.parseToken("%");
            sinon.assert.calledOnce(spy);
        });

        it('should parse `', function () {
            let spy = sinon.spy(bef, "greaterThan");
            bef.parseToken("`");
            sinon.assert.calledOnce(spy);
        });

        it('should parse !', function () {
            let spy = sinon.spy(bef, "not");
            bef.parseToken("!");
            sinon.assert.calledOnce(spy);
        });

        it('should parse _', function () {
            let spy = sinon.spy(bef, "horizontalIf");
            bef.parseToken("_");
            sinon.assert.calledOnce(spy);
        });

        it('should parse |', function () {
            let spy = sinon.spy(bef, "verticalIf");
            bef.parseToken("|");
            sinon.assert.calledOnce(spy);
        });

        it('should parse :', function () {
            let spy = sinon.spy(bef, "duplicate");
            bef.parseToken(":");
            sinon.assert.calledOnce(spy);
        });

        it('should parse \\', function () {
            let spy = sinon.spy(bef, "swap");
            bef.parseToken("\\");
            sinon.assert.calledOnce(spy);
        });

        it('should parse $', function () {
            let spy = sinon.spy(bef, "discard");
            bef.parseToken("$");
            sinon.assert.calledOnce(spy);
        });

        it('should parse .', function () {
            let spy = sinon.spy(bef, "outInt");
            bef.parseToken(".");
            sinon.assert.calledOnce(spy);
        });

        it('should parse ,', function () {
            let spy = sinon.spy(bef, "outAscii");
            bef.parseToken(",");
            sinon.assert.calledOnce(spy);
        });

        it('should parse #', function () {
            let spy = sinon.spy(bef, "bridge");
            bef.parseToken("#");
            sinon.assert.calledOnce(spy);
        });

        it('should parse g', function () {
            let spy = sinon.spy(bef, "get");
            bef.parseToken("g");
            sinon.assert.calledOnce(spy);
        });

        it('should parse p', function () {
            let spy = sinon.spy(bef, "put");
            bef.parseToken("p");
            sinon.assert.calledOnce(spy);
        });

        it('should parse &', function () {
            let spy = sinon.spy(bef, "inInt");
            bef.onInput = () => { return 0;};
            bef.parseToken("&");
            sinon.assert.calledOnce(spy);
        });

        it('should parse ~', function () {
            bef.onInput = () => { return "a";};
            let spy = sinon.spy(bef, "inAscii");
            bef.parseToken("~");
            sinon.assert.calledOnce(spy);
        });

        it('should parse `', function () {
            let spy = sinon.spy(bef, "greaterThan");
            bef.parseToken("`");
            sinon.assert.calledOnce(spy);
        });

        it('should parse @', function () {
            let spy = sinon.spy(bef, "terminateProgram");
            bef.parseToken("@");
            sinon.assert.calledOnce(spy);
        });
    });

    describe('#loadProgram', function () {
        it('should load program characters', function () {
            bef.loadProgram("123\n456\n,.@");
            expect(bef.program[0][0]).to.equal("1");
            expect(bef.program[0][1]).to.equal("2");
            expect(bef.program[0][2]).to.equal("3");
            expect(bef.program[1][0]).to.equal("4");
            expect(bef.program[1][1]).to.equal("5");
            expect(bef.program[1][2]).to.equal("6");
            expect(bef.program[2][0]).to.equal(",");
            expect(bef.program[2][1]).to.equal(".");
            expect(bef.program[2][2]).to.equal("@");
        });
    });

    describe('#getToken', function () {
        it('should retrieve a token from program', function () {
            bef.loadProgram("123\n456\n,.@");
            expect(bef.getToken(0, 0)).to.equal("1");
            expect(bef.getToken(1, 1)).to.equal("5");
            expect(bef.getToken(2, 2)).to.equal("@");
        });
    });

    describe('#init', function () {
        it('should load the program', function () {
            bef.loadProgram("123\n456\n,.@");
            expect(bef.program[0][0]).to.equal("1");
            expect(bef.program[0][1]).to.equal("2");
            expect(bef.program[0][2]).to.equal("3");
            expect(bef.program[1][0]).to.equal("4");
            expect(bef.program[1][1]).to.equal("5");
            expect(bef.program[1][2]).to.equal("6");
            expect(bef.program[2][0]).to.equal(",");
            expect(bef.program[2][1]).to.equal(".");
            expect(bef.program[2][2]).to.equal("@");
        });

        it('should set hasNext to true', function () {
            bef.loadProgram("123\n456\n,.@");
            expect(bef.hasNext).to.be.true;
        });

        it('should set programLoaded to true', function () {
            bef.loadProgram("123\n456\n,.@");
            expect(bef.programLoaded).to.be.true;
        });

        it('throw an error if issue loading program');
    });
    describe('#stepInto', function () {
        it('should step and parse next token', function () {
            let spy = sinon.spy(bef, "pushHexValueToStack");
            bef.loadProgram("123\n456\n,.@");
            bef.stepInto();
            sinon.assert.calledOnce(spy);
        });

        it('should only step and not parse a space', function () {
            let spy = sinon.spy(bef, "step");
            bef.loadProgram(" 23\n456\n,.@");
            bef.stepInto();
            sinon.assert.calledOnce(spy);
        });

        it('parse multiple spaces at a time', function () {
            let spy = sinon.spy(bef, "step");
            bef.loadProgram("     v\n456\n,.@");
            bef.stepInto();
            expect(spy.callCount).to.equal(5);
        });
    });
    describe('#pause', function () {
        it('should set hasNext to false', function () {
            bef.pause();
            expect(bef.hasNext).to.be.false;
        });
    });
    describe('#resume', function () {
        it('should set hasNext to true', function () {
            bef.resume();
            expect(bef.hasNext).to.be.true;
        });
    });
    describe('#run', function () {

        describe('should call onTick if provided', function () {


        });

        it('should reset if reset is true', function () {
            let spy = sinon.spy(bef, 'reset');
            bef.run("12312@");
            bef.run("123@", true);
            expect(spy.callCount).to.equal(1);
        });

        it('should give expected output for program', function () {
            bef.run("8:>1# -# :_$>\\# :#*_$.@");
            expect(bef.output).to.equal("40320 ");
        });

        it('should give expected output for program', function () {
            bef.run("##\"57*:,,48*2+,>:#,_48*2+,57*,          @          ,*75,+2*84_,#:>,+2*84,,:*75\"#");
            expect(bef.output).to.equal("##\"57*:,,48*2+,>:#,_48*2+,57*,          @          ,*75,+2*84_,#:>,+2*84,,:*75\"#");
        });

        it('should do test bridge right', function () {
            bef.run(">>>>v\n" +
                "@0.v>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>#\n" +
                "#<<<                                                                        @.1@");
            expect(bef.output).to.equal("0 1 ");
        });
    });
    describe('#reset', function () {
        it('should reset befunge to default state', function () {
            bef.stack = [1, 2, 3, 4, 5];
            bef.output = "asfasdgagag";
            bef.loadProgram('q451424\n145123523\n1231235t2');
            bef.x = 5;
            bef.y = 123;
            bef.dX = -1;
            bef.dY = -1;
            bef.stringMode = true;
            bef.reset();
            expect(bef.stack).to.deep.equal([]);
            expect(bef.output).to.equal("");
            expect(bef.x).to.equal(0);
            expect(bef.y).to.equal(0);
            expect(bef.dX).to.equal(1);
            expect(bef.dY).to.equal(0);
        });
    });
});
