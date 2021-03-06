const mongoose = require("mongoose")
const db = require("../connections/statistics.db")

const visitSchema = mongoose.Schema({
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
        required: true,
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
}, { timestamps: true })

module.exports.Visits = db.model("Visits", visitSchema)


const visitsLogSchema = mongoose.Schema({
    url: {
        type: String,
        require: true,
    },
    date: {
        type: String,
        required: true
    },
    visitors: {
        type: Object,
        defualt: {}
    }
}, { timestamps: true })


module.exports.VisitsLog = db.model("VisitsLog", visitsLogSchema)

