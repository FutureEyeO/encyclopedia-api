const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
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
    email: {
        type: String,
        max: 50,
        required: true,
        unique: true
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
    isAdmin: {
        type: Boolean,
        default: false
    },
    isAuthor: {
        type: Boolean,
        defualt: false,
    },
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
    },
    
    user_agent: {
        type: String,
        require: true,
        min: 1
    },

    user_id: {
        type: String,
        require: true,
        min: 10,
        unique: true
    },

    login_time: {
        type: Number,
        require: true,
    },

    login_count: {
        type: Number,
        default: 0
    },

    login_id: {
        type: String,
        require: true,
        min: 10,
        unique: true
    }, 

    login_password: {
        type: String,
        require: true,
        min: 10,
        unique: true
    }

}, { timestamps: true })

module.exports = mongoose.model("Login", loginSchema)