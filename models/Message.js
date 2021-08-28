const mongoose = require('mongoose');
const db = require("../connections/api.db")

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

module.exports = db.model("Message", messageSchema)