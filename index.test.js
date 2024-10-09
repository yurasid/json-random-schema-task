const assert = require("node:assert");
const test = require('node:test');
const { populateSchema } = require(".");

test('type stirng', () => {
    const result = populateSchema({ type: "string" });
    assert.equal(typeof result, 'string');
});

test('type stirng, has regex', () => {
    const result = populateSchema({ type: "string", pattern: "foo" });
    assert.equal('regex', result);
});

test('type integer', (t) => {
    const result = populateSchema({ type: 'integer' })
    assert.equal(typeof result, 'number');
});

test('type integer has min', () => {
    const result = populateSchema({ type: 'integer', minimum: 1000, maximum: 1002 })
    assert.strictEqual(result >= 1000, true);
});

test('type integer has max', () => {
    const result = populateSchema({ type: 'integer', minimum: 0, maximum: 2 })
    assert.strictEqual(result < 2, true);
});

test('type null', () => {
    const result = populateSchema({ type: 'null' })
    assert.strictEqual(result, null);
});

test('type bool', () => {
    const result = populateSchema({ type: 'boolean' })
    assert.strictEqual(typeof result, 'boolean');
});

test('anyOf returns correct type', (t) => {
    let getResult = () => populateSchema({ anyOf: [
        { type: 'string' },
        { type: 'integer' },
        { type: 'boolean' },
        { type: 'null' }
    ] });

    t.mock.method(Math, 'random', () => 0)
    assert.strictEqual(typeof getResult(), 'string');
    t.mock.method(Math, 'random', () => 0.3)
    assert.strictEqual(typeof getResult(), 'number');
    t.mock.method(Math, 'random', () => 0.6)
    assert.strictEqual(typeof getResult(), 'boolean');
    t.mock.method(Math, 'random', () => 0.8)
    assert.strictEqual(getResult(), null);
});

test('type enum', (t) => {
    const getResult = () => populateSchema({ enum: ['a', 'b', 'c']})
    t.mock.method(Math, 'random', () => 0.2);
    assert.equal(getResult(), 'a');
    t.mock.method(Math, 'random', () => 0.8);
    assert.equal(getResult(), 'c');
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

test('required filed', (t) => {
    const schema = {
        type: "object",
        properties: {
            a: {
                type: "string"
            },
            b: {
                type: "string"
            }
        },
        required: ["a"],
    }

    const getResult = () => populateSchema(schema);

    assert.deepEqual(getResult(), {
        a: 'string',
    })
});
