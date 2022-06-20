

const msgSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    sentAt: {
        type: String,
        default: 'NA',
    },
});

module.exports = mongoose.model('Message', msgSchema);