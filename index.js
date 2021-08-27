const path = require("path")
const https = require("https");
const fs = require("fs")

const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require('helmet');
const morgan = require("morgan")
const useragent = require('express-useragent');
const cors = require("cors")

const app = express();

const usersRouter = require("./routers/users")
const authRouter = require("./routers/auth")
const postsRouter = require("./routers/posts")
const uploadRouter = require("./routers/upload")
const conversationRouter = require("./routers/conversation")
const messageRouter = require("./routers/message")
const statisticRouter = require("./routers/statistics")






dotenv.config()

// mongodb username : medical-encyclopedia-admin
// mongodb password : qYcofBR1XD6O5B8V

const MONGO_URL = "mongodb+srv://admin:qYcofBR1XD6O5B8V@cluster0.xbjue.mongodb.net/main?retryWrites=true&w=majority"


mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) console.log("[!] - haven't connected to MongoDB")
    else console.log("[+] - have conncted successfully ")
})



// ############ -- ############ 

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Connection Error:'));

// db.once('open', () => {

//     app.listen("8800", () => {
//         print("[+] - server : listen port --> 8800")
//     })

//     const userCollection = db.collection('users');
//     const changeStreamUser = userCollection.watch();

//     changeStreamUser.on('change', (change) => {
//         console.log(change)
//     });

//     const postCollection = db.collection('posts');
//     const changeStreamPost = postCollection.watch();

//     changeStreamPost.on('change', (change) => {
//         console.log(change)
//     });
// });
// ############ -- ############ 




app.use(cors({
    origin: "*"
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use(helmet())
app.use(morgan("common"))
app.use(useragent.express());

app.use("/api/public", express.static(path.join(__dirname, "public")))

app.use("/api/users", usersRouter)
app.use("/api/auth", authRouter)
app.use("/api/posts", postsRouter)
app.use("/api/upload", uploadRouter)
app.use("/api/conversation", conversationRouter)
app.use("/api/message", messageRouter)
app.use("/api/statistics", statisticRouter)

const port = process.env.PORT || 8800

app.listen(port, () => {
    console.log("[+] - server : listen port --> " + port)
})


// const o = async () => {
//     const data = await Api.checkAdmin("234897389654") 
//     console.log(data)
// }
// o()