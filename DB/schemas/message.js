const mongoose = require('mongoose');

const { Schema } = mongoose;

const fields = {
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    text: {
        type: Schema.Types.String,
    },
};

const modelSchema = new Schema(fields, { timestamps: true });

module.exports = mongoose.model('Message', modelSchema);
