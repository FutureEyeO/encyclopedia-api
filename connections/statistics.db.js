const mongoose = require("mongoose")

const MONGO_URL = "mongodb+srv://admin:qYcofBR1XD6O5B8V@cluster0.xbjue.mongodb.net/statistics?retryWrites=true&w=majority"
const connection = mongoose.createConnection(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) console.log("[!] - haven't connected to MongoDB")
    else console.log("[+] - have conncted successfully ")
})

module.exports = connection