const msgmongoose = require('mongoose');

const msgSchema = new msgmongoose.Schema({

    toUserId: {
        type: String,
        required: true,
    },
    fromUserId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    messages: { type: Array, "default": [] },
});

module.exports = msgmongoose.model('Message', msgSchema);