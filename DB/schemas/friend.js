const mongoose = require('mongoose');

const { Schema } = mongoose;

const fields = {
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    status: {
        type: Schema.Types.String,
        enum: ['requested', 'accepted', 'rejected', 'blocked'],
        default: 'requested',
    },
};

const modelSchema = new Schema(fields, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Friend', modelSchema);
