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


const apiRouter = require("./api")
const statisticsRouter = require("./statistics.api")


dotenv.config()



app.use(cors({
    origin: "*"
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use(helmet())
app.use(morgan("common"))
app.use(useragent.express());

app.use("/api", apiRouter)
app.use("/statistics", statisticsRouter)

const port = process.env.PORT || 8800

app.listen(port, () => {
    console.log("[+] - server : listen port --> " + port)
})
