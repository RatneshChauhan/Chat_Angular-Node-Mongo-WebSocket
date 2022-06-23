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
    messages: { type : Array , "default" : [] },
});

module.exports = msgmongoose.model('Message', msgSchema);