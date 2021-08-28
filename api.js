const path = require("path")
const https = require("https");
const fs = require("fs")

const mongoose = require("mongoose")
const express = require("express")
const router = require("express").Router()

const usersRouter = require("./routers/users")
const authRouter = require("./routers/auth")
const postsRouter = require("./routers/posts")
const uploadRouter = require("./routers/upload")
const conversationRouter = require("./routers/conversation")
const messageRouter = require("./routers/message")




// mongodb username : medical-encyclopedia-admin
// mongodb password : qYcofBR1XD6O5B8V

// const MONGO_URL = "mongodb+srv://admin:qYcofBR1XD6O5B8V@cluster0.xbjue.mongodb.net/main?retryWrites=true&w=majority"

// mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
//     if (err) console.log("[!] - haven't connected to MongoDB")
//     else console.log("[+] - have conncted successfully ")
// })



router.use("/public", express.static(path.join(__dirname, "public")))


router.use("/users", usersRouter)
router.use("/auth", authRouter)
router.use("/posts", postsRouter)
router.use("/upload", uploadRouter)
router.use("/conversation", conversationRouter)
router.use("/message", messageRouter)

module.exports = router