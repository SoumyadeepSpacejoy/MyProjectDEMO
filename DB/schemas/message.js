const mongoose = require('mongoose');

const { Schema } = mongoose;

const fields = {
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        index: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    text: {
        type: Schema.Types.String,
    },
    deletedFor: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
};

const modelSchema = new Schema(fields, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Message', modelSchema);
