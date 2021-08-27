const mongoose = require("mongoose")

const statisticSchema = mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        defualt: ""
    },
    url: {
        type: String,
        defualt: "",
        require: true,
    },
    timeTaken: {
        type: Number,
        defualt: 0,
        required: true,
    },
    ipInfo: {
        type: Object,
        defualt: {}
    },
    visitCount: {
        type: Number,
        defualt: 0
    }
})

module.exports = mongoose.model("Statistic", statisticSchema)