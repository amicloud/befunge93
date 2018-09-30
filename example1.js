const Befunge = require('./befunge93');
let befunge = new Befunge();
befunge.run("1234v\n>9 #5>:#._@\n^876<", true)
    .then((output) => {
        console.log(output);
    });

befunge.run("110g,@", true)
    .then((output) => {
        console.log(output);
    });