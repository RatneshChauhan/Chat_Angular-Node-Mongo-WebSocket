const msgmongoose = require('mongoose');

const msgSchema = new msgmongoose.Schema({

    userId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    sentAt: {
        type: String,
        default: 'NA',
    },
});

module.exports = msgmongoose.model('Message', msgSchema);