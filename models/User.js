const mongoose = require('mongoose');
const db = require("../connections/api.db")

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        min: 3,
        max: 16,
        required: true,
        unique: true
    },
    name: {
        type: String, 
        min: 3,
        max: 20,
        required: true,
    },
    ip: {
        type: String,
        defualt: "", 
    },
    email: {
        type: String,
        max: 50,
        required: true,
        unique: true
    },
    website: {
        type: String,
        defualt: ""
    },
    password: {
        type: String,
        min: 6,
        required: true,
    },
    profileImg: {
        type: String,
        default: ""
    },
    coverImg: {
        type: String, 
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    // isAdmin: {
    //     type: Boolean,
    //     default: false,
    // },
    // isAuthor: {
    //     type: Boolean,
    //     defualt: false,
    // },
    desc: {
        type: String,
        max: 50
    },
    posts: {
        type: Array,
        default: []
    },
    posts_likes: {
        type: Array,
        default: []
    }
}, { timestamps: true })

module.exports = db.model("User", userSchema)