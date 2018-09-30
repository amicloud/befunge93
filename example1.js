const Befunge = require('./befunge93');

let befunge = new Befunge();

befunge.run("1234v\n>9 #5>:#._@\n^876<")
    .then((output) => {
        console.log(output);
    });