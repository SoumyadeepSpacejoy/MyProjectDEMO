'use strict';

const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const schemas = require('./schemas');

const connect = async (uri) => {
    try {
        mongoose.plugin(slug);
        await mongoose.connect(uri, {
            useNewUrlParser: true,
        });
        console.log('MongoDB connected... 🔥');
        return mongoose;
    } catch (e) {
        console.log('MongoDB error', e);
        return Promise.reject(new Error('Unable to connect DB'));
    }
};

const init = () => {
    console.log('Schemas loaded... 😴');
    return schemas;
};

module.exports = {
    connect,
    init,
};
