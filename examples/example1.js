const Befunge = require('../lib/befunge93');

let befunge = new Befunge();

befunge.run("1234v\n>9 #5>:#._@\n^876<")
    .then((output) => {
        console.log(output);
    })
    .catch((err) => {
        console.error('Error running program:', err.message);
    });
