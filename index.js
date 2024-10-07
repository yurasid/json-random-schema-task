const s = require('./json-schema.json');

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomArrayEl(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function populateSchema(schema, definitions) {
    if (schema.definitions)
        definitions = schema.definitions;
    if (schema.anyOf !== undefined)
        return populateSchema(getRandomArrayEl(schema.anyOf), definitions);
    if (schema.enum !== undefined)
        return getRandomArrayEl(schema.enum);
    if (schema.type === 'boolean')
        return Boolean(getRandomInteger(0, 1));
    if (schema.type === 'null')
        return null;
    if (schema.type === 'string')
        return schema.pattern ? 'regex' : 'string';
    if (schema.type === 'integer')
        return getRandomInteger(schema.minimum ?? 0, schema.maximum ?? 10);
    if (schema.type === 'object') {
        return schema.properties ? Object.keys(schema.properties).reduce((acc, property) => {
            acc[property] = populateSchema(schema.properties[property], definitions);
            return acc;
        }, {}) : {};
    }
    if (schema.type === 'array') {
        if (schema.items === undefined) return [];
        const entity = schema.items['$ref'].slice(1);
        return Array
            .from({ length: getRandomInteger(0, 10)})
            .map(_ => populateSchema(definitions[entity], definitions));
    }
}

module.exports = {
    getRandomInteger,
    populateSchema,
}

console.log(populateSchema(s))