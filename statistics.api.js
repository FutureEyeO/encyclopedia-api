const path = require("path")
const https = require("https");
const fs = require("fs")

const mongoose = require("mongoose")
const express = require("express")
const router = require("express").Router()

const visitsRouter = require("./routers/visits")


// mongodb username : medical-encyclopedia-admin
// mongodb password : qYcofBR1XD6O5B8V

// const MONGO_URL = "mongodb+srv://admin:qYcofBR1XD6O5B8V@cluster0.xbjue.mongodb.net/statistics?retryWrites=true&w=majority"

// mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
//     if (err) console.log("[!] - haven't connected to MongoDB")
//     else console.log("[+] - have conncted successfully ")
// })


router.use("/visits", visitsRouter)

module.exports = router