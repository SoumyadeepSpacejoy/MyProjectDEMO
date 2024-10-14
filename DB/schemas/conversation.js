const mongoose = require('mongoose');

const { Schema } = mongoose;

const fields = {
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
    ],
    //isGroup, name, createdBy is for group only...
    isGroup: {
        type: Schema.Types.Boolean,
        default: 'false',
    },
    name: {
        type: Schema.Types.String,
        index: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
};

const modelSchema = new Schema(fields, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Conversation', modelSchema);
