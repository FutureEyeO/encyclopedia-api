const mongoose = require('mongoose');
const db = require("../connections/api.db")

const conversationSchema = new mongoose.Schema({
    members: {
        type: Array,
        required: true,
    }
}, { timestamps: true })

module.exports = db.model("Conversation", conversationSchema)