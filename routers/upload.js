const router = require("express").Router()
const multer = require("multer")
const fs = require("fs");
const path = require("path")

const PATH_POST = `public/post`
const PATH_USER = `public/user`

const storagePostImage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file)
        let userId = req.params.userId
        let pathUserPost = path.join(PATH_POST, userId)
        let pathStorePost = path.join(pathUserPost, "images")
        console.log(pathStorePost)

        console.log(pathStorePost)
        if (!fs.existsSync(pathUserPost)) {

            fs.mkdir(pathUserPost, (err) => {
                console.error(err)
            })
        }
        if (!fs.existsSync(pathStorePost)) {
            fs.mkdir(pathStorePost, (err) => {
                console.error(err)
            })
        }

        cb(null, pathStorePost)
    },
    filename: (req, file, cb) => {
        // console.log(filename, file)
        let filename = `${req.params.filename}`
        cb(null, filename)
    }
})

const uploadPostImage = multer({ storage: storagePostImage });

router.post("/post/:userId/:filename", uploadPostImage.single("file"), (req, res) => {
    try {
        res.status(200).json("file uploaded successfully")
    } catch (err) {
        res.status(500).json(err)
    }
})



const storageUserImage = multer.diskStorage({
    destination: (req, file, cb) => {
        let userId = req.params.userId
        let pathStoreUserImg = path.join(PATH_USER, userId)
        console.log(pathStoreUserImg)
        if (!fs.existsSync(pathStoreUserImg)) {
            fs.mkdir(pathStoreUserImg, (err) => {
                console.error(err)
            })
        }

        cb(null, pathStoreUserImg)
    },
    filename: (req, file, cb) => {
        let filename = `${req.params.filename}`
        cb(null, filename)
    }
})

const uploadUserImage = multer({ storage: storageUserImage });

router.post("/user/:userId/:filename", uploadUserImage.single("file"), (req, res) => {
    try {
        res.status(200).json("file uploaded successfully")
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router
