const test = require('node:test');
const assert = require('node:assert');
const Befunge = require('../lib/befunge93');

test('pop returns last value and removes it', () => {
  const bef = new Befunge();
  bef.stack = [1,2,3];
  assert.strictEqual(bef.pop(), 3);
  assert.deepStrictEqual(bef.stack, [1,2]);
});

test('pop on empty stack returns 0', () => {
  const bef = new Befunge();
  assert.strictEqual(bef.pop(), 0);
});

test('step wraps x when moving right from 79', () => {
  const bef = new Befunge();
  bef.right();
  bef.x = 79;
  bef.step();
  assert.strictEqual(bef.x, 0);
});

test('parseToken pushes hex digits to stack', () => {
  const bef = new Befunge();
  bef.parseToken('a');
  bef.parseToken('F');
  assert.deepStrictEqual(bef.stack, [10, 15]);
});

// simple program: pushes 1, outputs as integer then stops
const program = '1.@';

test('run executes simple program', async () => {
  const bef = new Befunge();
  const output = await bef.run(program);
  assert.strictEqual(output.trim(), '1');
});
