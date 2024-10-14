const mongoose = require('mongoose');

const { Schema } = mongoose;

const fields = {
    name: {
        type: Schema.Types.String,
        required: true,
        index: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
        index: true,
    },
    password: {
        type: Schema.Types.String,
        required: true,
        index: true,
    },
    phone: {
        type: Schema.Types.Number,
        required: true,
        index: true,
    },
    role: {
        type: Schema.Types.String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    status: {
        type: Schema.Types.String,
        enum: ['online', 'offline'],
        default: 'offline',
        index: true,
    },
};

const modelSchema = new Schema(fields, { timestamps: true, versionKey: false });

module.exports = mongoose.model('User', modelSchema);
