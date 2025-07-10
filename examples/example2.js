const Befunge = require('../lib/befunge93');
let befunge = new Befunge();

const readLine = require('readline-sync');
befunge.onInput = (message) => {
    console.log(message);
    return readLine.prompt();
};

befunge.onOutput = (output) => {
    console.log(output);
};

befunge.onStep = (x, y) => {
    console.log(`Current x position: ${x}`);
    console.log(`Current y position: ${y}`);
};

befunge.onCellChange = (x, y, newValue) => {
    console.log(`Cell at ${x}, ${y} has been updated to ${newValue.toString()}`);
};

befunge.onStackChange = (stack) => {
    console.log(`Current stack: ${stack.toString()}`);
};

befunge.run("1123v\n>89#4>:#._@\n^765<")
    .then((output) => {
        console.log(output);
    })
    .catch((err) => {
        console.error('Error running program:', err.message);
    });
