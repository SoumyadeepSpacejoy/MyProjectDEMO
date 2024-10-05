const { createClient } = require('redis');
const { cache } = require('../configs');

let connectUrl = `redis://${cache.host}:${cache.port}`;

const client = createClient({
    url: connectUrl,
});

client.on('error', (err) => console.log('Redis Client Error', err));

const connect = async () => {
    await client.connect();
    console.log('Redis Connected... 🍻');
};

const get = async (key) => {
    const data = await client.get(key);
    return JSON.parse(data);
};

const getRaw = async (key) => {
    return client.get(key);
};

const set = async (key, value, ex = 86400 * 12) => {
    const valueStr = JSON.stringify(value);
    await client.set(key, valueStr);
    if (ex) {
        client.expire(key, parseInt(ex, 10));
    }
};

const setRaw = async (key, value, ex = 86400 * 12) => {
    await client.set(key, value);
    if (ex) {
        client.expire(key, parseInt(ex, 10));
    }
};

const keys = async (key) => {
    const scanData = await client.scan(0, { MATCH: key });
    const allKeys = scanData.keys;
    console.log('🚀 ~ keys ~ keys:', allKeys);

    return allKeys;
};

const remove = (key) => {
    return client.del(key);
};

const append = (key, data) => {
    return client.append(key, data);
};

const exists = (key) => {
    return client.exists(key);
};

const Z = (key) => {
    return {
        add: (member, score) => {
            return client.zAdd(key, { score: score, value: member });
        },
        get: (skip = 0, limit = 0) => {
            return client.zRangeWithScores(key, skip, limit);
        },

        remove: (member) => {
            return client.zRem(key, member);
        },
    };
};

module.exports = {
    get,
    getRaw,
    set,
    setRaw,
    connect,
    remove,
    keys,
    append,
    exists,
    Z,
};
