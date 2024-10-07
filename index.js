const s = require('./json-schema.json');

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function populateSchema(schema, definitions) {
    if (schema.definitions) definitions = schema.definitions;
    if (schema.anyOf !== undefined) {
        let s = schema.anyOf[Math.floor(Math.random() * schema.anyOf.length)];
        return populateSchema(s, definitions);
    }
    if (schema.enum !== undefined) {
        return schema.enum[Math.floor(Math.random() * schema.enum.length)];
    }
    if (schema.type === 'boolean') return Boolean(getRandomInteger(0, 1));
    if (schema.type === 'null') return null;
    if (schema.type === 'string') {
        if (schema.pattern) return 'regex'
        return 'string';
    }
    if (schema.type === 'integer') {
        return getRandomInteger(schema.minimum ?? 0, schema.maximum ?? 10);
    }
    if (schema.type === 'object') {
        return schema.properties ? Object.keys(schema.properties).reduce((acc, property) => {
            acc[property] = populateSchema(schema.properties[property], definitions);
            return acc;
        }, {}) : {};
    }
    if (schema.type === 'array') {
        if (schema.items === undefined) return [];
        console.log(schema)
        const entity = schema.items['$ref'].slice(1);
        return Array.from({ length: getRandomInteger()}).map(_ => populateSchema(definitions[entity], definitions));
    }
}

module.exports = {
    getRandomInteger,
    populateSchema,
}

console.log(populateSchema(s))