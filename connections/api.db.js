const mongoose = require("mongoose")

const dotenv = require("dotenv")
dotenv.config()

const connection = mongoose.createConnection(process.env.MONGO_API_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) console.log("[!] - haven't connected to MongoDB")
    else console.log("[+] - have conncted successfully ")
})

module.exports = connection