const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
    },
    senderId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        min: 1,
        max: 200
    }
}, { timestamps: true })

module.exports = mongoose.model("Message", messageSchema)