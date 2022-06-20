const msgmongoose = require('mongoose');

const msgSchema = new msgmongoose.Schema({

    conversationId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    totalMessages: {
        type: Number,
        required: false,
    },
    
    messages: { type: Array, "default": [] },
    //members: { type: Array, "default": [] },
});

module.exports = msgmongoose.model('Conversation', msgSchema);