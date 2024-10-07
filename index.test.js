const assert = require("node:assert");
const test = require('node:test');
const { populateSchema } = require(".");

const s = require('./json-schema.json');

let random;

test('only stirng', (t) => {
    const result = populateSchema({ type: "string" });
    assert.equal(result, 'string');
});

test('only stirng, has regex', (t) => {
    const result = populateSchema({ type: "string", pattern: "foo" });
    assert.equal('regex', result);
});

test('only integer', (t) => {
    const result = populateSchema({ type: 'integer' })
    assert.equal(typeof result, 'number');
});

test('int has min', () => {
    const result = populateSchema({ type: 'integer', minimum: 1000, maximum: 1002 })
    assert.strictEqual(result >= 1000, true);
});

test('int has max', () => {
    const result = populateSchema({ type: 'integer', minimum: 0, maximum: 2 })
    assert.strictEqual(result < 2, true);
});

test('only null', () => {
    const result = populateSchema({ type: 'null' })
    assert.strictEqual(result, null);
});

test('only bool/f', () => {
    const result = populateSchema({ type: 'boolean' })
    assert.strictEqual(result, false);
});

test('only bool/t', () => {
    random = Math.random;
    Math.random = () => 1;
    const result = populateSchema({ type: 'boolean' })
    assert.strictEqual(result, true);
    Math.random = random;
});

test('only anyOf return second enum', () => {
    const result = populateSchema({ anyOf: [{ type: 'string' }] })
    assert.strictEqual(typeof result, 'string');
});

test('only enum', () => {
    const res = populateSchema({ enum: ['a']})
    assert.equal(res, 'a')
});

test('definition', () => {
    const result = populateSchema({
        type: 'object',
        definitions: {
            foo: {
                type: 'object',
                properties: {
                    bar: {
                        type: 'string'
                    }
                }
            }
        },
        properties: {
            az: {
                type: 'string'
            },
            foo: {
                type: "array",
                items: {
                    "$ref": "#foo"
                },
                default: []
            },
        }
     });

     assert.deepEqual(result.az, 'string')
     assert.deepEqual(typeof result.foo.length, 'number')
});
