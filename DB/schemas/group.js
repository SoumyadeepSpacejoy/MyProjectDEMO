const mongoose = require('mongoose');

const { Schema } = mongoose;

const fields = {
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
    ],
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            index: true,
        },
    ],
};

const modelSchema = new Schema(fields, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Group', modelSchema);
