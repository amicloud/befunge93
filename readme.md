[![Build Status](https://travis-ci.org/amicloud/befunge93.svg?branch=master)](https://travis-ci.org/amicloud/befunge93) [![Coverage Status](https://coveralls.io/repos/github/amicloud/befunge93/badge.svg?branch=master)](https://coveralls.io/github/amicloud/befunge93?branch=master) 
# Befunge93

Befunge93 is an interpreter written in JavaScript for the Befunge93 esoteric programming language.


## Installation

Befunge93 is available on npm!

```
npm install befunge93
```


### Getting started

To run a Befunge program, just create a new interpreter and call #run with your program as the argument.

\#run returns a promise that is resolved when the program terminates (by parsing a "@").

```javascript
const Befunge = require('befunge93');
let befunge = new Befunge();

befunge.run("1234v\n>9 #5>:#._@\n^876<")
    .then((output) => {
        console.log(output);
    });
```
Outputs: "9 8 7 6 5 4 3 2 1 "

### Advanced Usage

Befunge93 provides you with a few callbacks to hook into the interpreter. 

In order to provide the interpreter with input/output, you must supply the \#onInput and \#onOutput callbacks.

##### \#onInput
Called when the interpreter needs input from the user. Ie. the ~ and & commands.   
Example:
```javascript
befunge.onInput = (message) => {
    return prompt(message);
};
```

##### \#onOutput
Called when the interpreter outputs a character. Ie. the , and . commands  
Example:
```javascript
befunge.onOutput = (output) => {
    console.log(output);
};
```

##### \#onStep
Called when the program's cursor changes.  
Example:
```javascript
befunge.onStep = (x, y) => {
    console.log(`Current x position: ${x}`);
    console.log(`Current y position: ${y}`);
};
```

##### \#onStackChange
Called when the stack is updated.  
Example:
```javascript
befunge.onStackChange = (stack) => {
    console.log(`Current stack: ${stack.toString()}`);
};
```

##### \#onCellChange
Called when a cell is updated by the p command.  
Example:
```javascript
befunge.onCellChange = (x, y, newValue) => {
    console.log(`Cell at ${x}, ${y} has been updated to ${newValue.toString()}`);
};
```
