const mongoose = require('mongoose');
const db = require("../connections/api.db")

const postSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        defualt: ""
    },
    title: {
        type: String,
        max: 20
    },
    text: {
        type: String,
        max: 50000
    },
    desc: {
        type: String,
        max: 500
    },
    coverImg: {
        type: String,
        default: "",
        required: true
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    },
    relatedHash: {
        type: Array,
        default: []

    },
    viewsCount: {
        type: Number,
        default: 0
    }

}, { timestamps: true })

module.exports = db.model("Post", postSchema)